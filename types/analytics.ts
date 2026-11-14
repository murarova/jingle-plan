import type { PAYWALL_PLACEMENTS } from "@/constants/analytics";

export type PaywallPlacement =
  (typeof PAYWALL_PLACEMENTS)[keyof typeof PAYWALL_PLACEMENTS];

export type GuideOutcome = "completed" | "skipped";

export type PromocodeType = "android_custom" | "ios_offer_code";

export interface SubscriptionPurchaseParams {
  productId: string;
  transactionId: string;
  value: number;
  currency: string;
  isPromo?: boolean;
}

export type DayEventParams = {
  day_number: number;
  program_year: number;
};

export type DayOpenedParams = DayEventParams & {
  progress_percent: number;
};
