import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AppEventsLogger } from "react-native-fbsdk-next";
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperty,
} from "@react-native-firebase/analytics";
import {
  ANALYTICS_EVENTS,
  META_EVENTS,
  PAYWALL_VERSION,
  UNTRACKED_SCREENS,
} from "@/constants/analytics";
import type {
  DayEventParams,
  DayOpenedParams,
  PaywallPlacement,
  PromocodeType,
  SubscriptionPurchaseParams,
} from "@/types/analytics";

const LOGGED_TRANSACTIONS_KEY = "@analytics_logged_transactions";
const COMPLETED_DAYS_KEY_PREFIX = "@analytics_completed_days:";
const MAX_LOGGED_TRANSACTIONS = 100;
const MAX_COMPLETED_DAYS = 800;

type Params = Record<string, string | number | boolean | object[]>;

function swallow(action: () => unknown, label: string) {
  try {
    const result = action();
    if (result instanceof Promise) {
      result.catch((error) => {
        if (__DEV__) console.log(`Analytics "${label}" failed:`, error);
      });
    }
  } catch (error) {
    if (__DEV__) console.log(`Analytics "${label}" failed:`, error);
  }
}

function logFirebase(name: string, params?: Params) {
  swallow(() => logEvent(getAnalytics(), name, params), name);
}

function logMeta(name: string, params?: Record<string, string | number>) {
  swallow(
    () =>
      params ? AppEventsLogger.logEvent(name, params) : AppEventsLogger.logEvent(name),
    `meta:${name}`,
  );
}

async function claimOnce(
  storageKey: string,
  id: string,
  limit: number,
): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(storageKey);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (ids.includes(id)) return false;
    const next = [...ids, id].slice(-limit);
    await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    return true;
  } catch {
    return true;
  }
}

export function getPaywallId() {
  return `${Platform.OS}_${PAYWALL_VERSION}`;
}

export function getDayEventParams(dateString: string): DayEventParams | null {
  const programYear = Number(dateString.slice(0, 4));
  const dayNumber = Number(dateString.slice(8, 10));
  if (!Number.isInteger(programYear) || !Number.isInteger(dayNumber)) {
    return null;
  }
  return { day_number: dayNumber, program_year: programYear };
}

export function initializeAnalytics() {
  swallow(() => setAnalyticsCollectionEnabled(getAnalytics(), true), "init");
}

export function setAnalyticsUser(uid: string | null) {
  swallow(() => setUserId(getAnalytics(), uid), "setUserId");
}

export function setAnalyticsSubscriber(isSubscriber: boolean) {
  swallow(
    () =>
      setUserProperty(
        getAnalytics(),
        "is_subscriber",
        isSubscriber ? "true" : "false",
      ),
    "setUserProperty",
  );
  swallow(
    () => setUserProperty(getAnalytics(), "platform", Platform.OS),
    "setUserProperty",
  );
}

export function trackOnboardingComplete() {
  logFirebase(ANALYTICS_EVENTS.ONBOARDING_COMPLETE, { method: "email" });
  logMeta(META_EVENTS.COMPLETE_REGISTRATION, {
    fb_registration_method: "email",
  });
}

export function trackScreenView(screenName: string) {
  if (UNTRACKED_SCREENS.includes(screenName)) return;
  logFirebase(ANALYTICS_EVENTS.SCREEN_VIEW, {
    screen_name: screenName,
    screen_class: screenName,
  });
}

export function trackSkipOnboarding(step?: number) {
  logFirebase(
    ANALYTICS_EVENTS.SKIP_ONBOARDING,
    step === undefined ? undefined : { step },
  );
}

export function trackPaywallView(placement: PaywallPlacement) {
  const paywallId = getPaywallId();
  logFirebase(ANALYTICS_EVENTS.PAYWALL_VIEW, {
    paywall_id: paywallId,
    placement,
  });
  logMeta(META_EVENTS.CONTENT_VIEW, {
    fb_content_type: "paywall",
    fb_content_id: paywallId,
  });
}

export async function trackSubscriptionPurchase({
  productId,
  transactionId,
  value,
  currency,
  isPromo = false,
}: SubscriptionPurchaseParams) {
  const isNew = await claimOnce(
    LOGGED_TRANSACTIONS_KEY,
    transactionId,
    MAX_LOGGED_TRANSACTIONS,
  );
  if (!isNew) return;

  logFirebase(ANALYTICS_EVENTS.SUBSCRIPTION_STARTED, {
    product_id: productId,
    platform: Platform.OS,
    source: isPromo ? "promo" : "store",
  });

  if (isPromo || value <= 0) return;

  logFirebase(ANALYTICS_EVENTS.PURCHASE, {
    transaction_id: transactionId,
    value,
    currency,
    product_id: productId,
    platform: Platform.OS,
    items: [
      {
        item_id: productId,
        item_name: "subscription",
        quantity: 1,
        price: value,
      },
    ],
  });
  swallow(() => AppEventsLogger.logPurchase(value, currency), "meta:purchase");
  logMeta(META_EVENTS.SUBSCRIBE, { value, currency });
}

export function trackPromocodeApplied(codeType: PromocodeType) {
  logFirebase(ANALYTICS_EVENTS.PROMOCODE_APPLIED, {
    platform: Platform.OS,
    code_type: codeType,
  });
}

export function trackDayOpened(dateString: string, progressPercent: number) {
  const params = getDayEventParams(dateString);
  if (!params) return;
  const dayOpenedParams: DayOpenedParams = {
    ...params,
    progress_percent: Math.max(0, Math.min(100, Math.round(progressPercent))),
  };
  logFirebase(ANALYTICS_EVENTS.DAY_OPENED, dayOpenedParams);
}

export async function trackDayCompleted(
  dateString: string,
  uid: string | null | undefined,
) {
  const params = getDayEventParams(dateString);
  if (!params) return;
  const isNew = await claimOnce(
    `${COMPLETED_DAYS_KEY_PREFIX}${uid ?? "anonymous"}`,
    dateString,
    MAX_COMPLETED_DAYS,
  );
  if (!isNew) return;
  logFirebase(ANALYTICS_EVENTS.DAY_COMPLETED, params);
}
