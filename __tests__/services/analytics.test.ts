import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { logEvent } from "@react-native-firebase/analytics";
import {
  getDayEventParams,
  trackDayCompleted,
  trackDayOpened,
  trackOnboardingComplete,
  trackPaywallView,
  trackPromocodeApplied,
  trackScreenView,
  trackSkipOnboarding,
  trackSubscriptionPurchase,
} from "../../services/analytics";

const mockLogEvent = logEvent as jest.Mock;
const mockMetaLogEvent = AppEventsLogger.logEvent as jest.Mock;
const mockMetaLogPurchase = AppEventsLogger.logPurchase as jest.Mock;

const firebaseEvents = () => mockLogEvent.mock.calls.map((call) => call[2]);

describe("analytics service", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("parses day number and program year from a date string", () => {
    expect(getDayEventParams("2026-12-07")).toEqual({
      day_number: 7,
      program_year: 2026,
    });
    expect(getDayEventParams("bad")).toBeNull();
  });

  it("logs day_opened with day_number, program_year and progress_percent", () => {
    trackDayOpened("2026-12-07", 50);
    expect(mockLogEvent).toHaveBeenCalledWith(expect.anything(), "day_opened", {
      day_number: 7,
      program_year: 2026,
      progress_percent: 50,
    });
  });

  it("clamps and rounds progress_percent", () => {
    trackDayOpened("2026-12-07", 133.4);
    trackDayOpened("2026-12-08", 33.6);
    expect(firebaseEvents().map((p) => p.progress_percent)).toEqual([100, 34]);
  });

  it("logs day_completed once per user and day", async () => {
    await trackDayCompleted("2026-12-07", "uid-1");
    await trackDayCompleted("2026-12-07", "uid-1");
    await trackDayCompleted("2026-12-08", "uid-1");
    const completed = mockLogEvent.mock.calls.filter(
      (call) => call[1] === "day_completed",
    );
    expect(completed).toHaveLength(2);
  });

  it("logs paywall_view with paywall_id and placement and mirrors it to Meta", () => {
    trackPaywallView("app_menu");
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      "paywall_view",
      expect.objectContaining({
        placement: "app_menu",
        paywall_id: expect.stringContaining("default_v1"),
      }),
    );
    expect(mockMetaLogEvent).toHaveBeenCalledWith(
      "fb_mobile_content_view",
      expect.any(Object),
    );
  });

  it("logs onboarding_complete and mirrors it to Meta", () => {
    trackOnboardingComplete();
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      "onboarding_complete",
      expect.any(Object),
    );
    expect(mockMetaLogEvent).toHaveBeenCalledWith(
      "fb_mobile_complete_registration",
      expect.any(Object),
    );
  });

  it("logs screen_view with the screen name and ignores the loading screen", () => {
    trackScreenView("DayOverview");
    trackScreenView("Loading");
    expect(mockLogEvent).toHaveBeenCalledTimes(1);
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      "screen_view",
      { screen_name: "DayOverview", screen_class: "DayOverview" },
    );
  });

  it("logs skip_onboarding with the step the user left on", () => {
    trackSkipOnboarding(2);
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      "skip_onboarding",
      { step: 2 },
    );
  });

  it("logs promocode_applied without the code itself", () => {
    trackPromocodeApplied("android_custom");
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      "promocode_applied",
      expect.objectContaining({ code_type: "android_custom" }),
    );
  });

  it("logs subscription_started and purchase for a paid transaction once", async () => {
    const params = {
      productId: "sub.monthly",
      transactionId: "tx-1",
      value: 4.99,
      currency: "USD",
    };
    await trackSubscriptionPurchase(params);
    await trackSubscriptionPurchase(params);

    const names = mockLogEvent.mock.calls.map((call) => call[1]);
    expect(names).toEqual(["subscription_started", "purchase"]);
    expect(firebaseEvents()[1]).toEqual(
      expect.objectContaining({
        transaction_id: "tx-1",
        value: 4.99,
        currency: "USD",
      }),
    );
    expect(mockMetaLogPurchase).toHaveBeenCalledTimes(1);
    expect(mockMetaLogPurchase).toHaveBeenCalledWith(4.99, "USD");
  });

  it("does not log revenue for promo transactions", async () => {
    await trackSubscriptionPurchase({
      productId: "sub.monthly",
      transactionId: "tx-promo",
      value: 4.99,
      currency: "USD",
      isPromo: true,
    });
    const names = mockLogEvent.mock.calls.map((call) => call[1]);
    expect(names).toEqual(["subscription_started"]);
    expect(mockMetaLogPurchase).not.toHaveBeenCalled();
  });
});
