export function isPromoEntitlementActive(
  promoExpiresAt: number | null | undefined,
  now = Date.now(),
): boolean {
  return typeof promoExpiresAt === "number" && promoExpiresAt > now;
}

export function computeIsSubscriber({
  hasActiveSubscription,
  activeProductId,
  promoExpiresAt,
  now = Date.now(),
}: {
  hasActiveSubscription: boolean;
  activeProductId: string | null;
  promoExpiresAt: number | null;
  now?: number;
}): boolean {
  return (
    hasActiveSubscription ||
    activeProductId != null ||
    isPromoEntitlementActive(promoExpiresAt, now)
  );
}

export function nextPromoExpiresAt(
  current: number | null,
  lookup:
    | { available: true; expiresAt: number | null }
    | { available: false },
): number | null {
  if (!lookup.available) {
    return current;
  }
  return lookup.expiresAt;
}

export function shouldResolveWithoutStoreCheck({
  hasSubscriptionIds,
  promoActive,
}: {
  hasSubscriptionIds: boolean;
  promoActive: boolean;
}): boolean {
  return !hasSubscriptionIds || promoActive;
}
