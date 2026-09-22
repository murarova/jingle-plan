import {
  computeIsSubscriber,
  nextPromoExpiresAt,
  shouldResolveWithoutStoreCheck,
} from "../../utils/iap-entitlement";

describe("computeIsSubscriber", () => {
  it("unlocks when a store subscription is active", () => {
    expect(
      computeIsSubscriber({
        hasActiveSubscription: true,
        activeProductId: null,
        promoExpiresAt: null,
      }),
    ).toBe(true);
  });

  it("unlocks when a promo year is still in the future", () => {
    expect(
      computeIsSubscriber({
        hasActiveSubscription: false,
        activeProductId: null,
        promoExpiresAt: Date.now() + 60_000,
      }),
    ).toBe(true);
  });

  it("does not unlock when a promo year has expired", () => {
    expect(
      computeIsSubscriber({
        hasActiveSubscription: false,
        activeProductId: null,
        promoExpiresAt: Date.now() - 1,
      }),
    ).toBe(false);
  });
});

describe("nextPromoExpiresAt", () => {
  it("keeps the in-memory year when the lookup is unavailable", () => {
    expect(
      nextPromoExpiresAt(1_700_000_000_000, { available: false }),
    ).toBe(1_700_000_000_000);
  });

  it("clears the year when the server says there is no promo", () => {
    expect(
      nextPromoExpiresAt(1_700_000_000_000, {
        available: true,
        expiresAt: null,
      }),
    ).toBeNull();
  });

  it("stores a successful expiry", () => {
    expect(
      nextPromoExpiresAt(null, { available: true, expiresAt: 42 }),
    ).toBe(42);
  });
});

describe("shouldResolveWithoutStoreCheck", () => {
  it("does not resolve store users before the store answers", () => {
    expect(
      shouldResolveWithoutStoreCheck({
        hasSubscriptionIds: true,
        promoActive: false,
      }),
    ).toBe(false);
  });

  it("resolves when an Android promo year is already active", () => {
    expect(
      shouldResolveWithoutStoreCheck({
        hasSubscriptionIds: true,
        promoActive: true,
      }),
    ).toBe(true);
  });

  it("resolves when there are no store products to check", () => {
    expect(
      shouldResolveWithoutStoreCheck({
        hasSubscriptionIds: false,
        promoActive: false,
      }),
    ).toBe(true);
  });
});
