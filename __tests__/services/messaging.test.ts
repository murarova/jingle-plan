import { Platform } from "react-native";
import {
  getAPNSToken,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@react-native-firebase/messaging";
import {
  PREMIUM_NOTIFICATION_TOPIC,
  retryPremiumTopicSync,
  syncPremiumTopicSubscription,
  unsubscribeFromPremiumTopic,
} from "../../services/messaging";

jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(() => ({})),
  getAPNSToken: jest.fn(),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
}));

const mockGetAPNSToken = getAPNSToken as jest.Mock;
const mockSubscribe = subscribeToTopic as jest.Mock;
const mockUnsubscribe = unsubscribeFromTopic as jest.Mock;

beforeEach(async () => {
  Platform.OS = "ios";
  mockGetAPNSToken.mockReset().mockResolvedValue("apns-token");
  await unsubscribeFromPremiumTopic();
  mockGetAPNSToken.mockClear();
  mockSubscribe.mockReset().mockResolvedValue(undefined);
  mockUnsubscribe.mockReset().mockResolvedValue(undefined);
});

describe("premium topic sync", () => {
  it("subscribes when eligible and an APNs token exists", async () => {
    await syncPremiumTopicSubscription(true);
    expect(mockSubscribe).toHaveBeenCalledWith(
      expect.anything(),
      PREMIUM_NOTIFICATION_TOPIC,
    );
  });

  it("defers the subscription on iOS until an APNs token is available", async () => {
    mockGetAPNSToken.mockResolvedValue(null);
    await syncPremiumTopicSubscription(true);
    expect(mockSubscribe).not.toHaveBeenCalled();

    mockGetAPNSToken.mockResolvedValue("apns-token");
    await retryPremiumTopicSync();
    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  it("does not check the APNs token on Android", async () => {
    Platform.OS = "android";
    mockGetAPNSToken.mockResolvedValue(null);
    await syncPremiumTopicSubscription(true);
    expect(mockGetAPNSToken).not.toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  it("does nothing on retry after logout", async () => {
    await syncPremiumTopicSubscription(true);
    await unsubscribeFromPremiumTopic();
    mockSubscribe.mockClear();

    await retryPremiumTopicSync();
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("unsubscribes when no longer eligible", async () => {
    await syncPremiumTopicSubscription(false);
    expect(mockUnsubscribe).toHaveBeenCalledWith(
      expect.anything(),
      PREMIUM_NOTIFICATION_TOPIC,
    );
  });
});
