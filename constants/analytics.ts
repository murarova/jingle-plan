export const ANALYTICS_EVENTS = {
  SCREEN_VIEW: "screen_view",
  ONBOARDING_COMPLETE: "onboarding_complete",
  SKIP_ONBOARDING: "skip_onboarding",
  PAYWALL_VIEW: "paywall_view",
  SUBSCRIPTION_STARTED: "subscription_started",
  PROMOCODE_APPLIED: "promocode_applied",
  PURCHASE: "purchase",
  DAY_OPENED: "day_opened",
  DAY_COMPLETED: "day_completed",
} as const;

export const META_EVENTS = {
  COMPLETE_REGISTRATION: "fb_mobile_complete_registration",
  CONTENT_VIEW: "fb_mobile_content_view",
  SUBSCRIBE: "Subscribe",
} as const;

export const PAYWALL_PLACEMENTS = {
  CALENDAR_LOCKED_DAY: "calendar_locked_day",
  LOCKED_CALENDAR_CARD: "locked_calendar_card",
  APP_MENU: "app_menu",
} as const;

export const PAYWALL_VERSION = "default_v1";

export const UNTRACKED_SCREENS: readonly string[] = ["Loading"];
