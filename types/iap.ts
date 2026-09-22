import type { Product } from "expo-iap";

export interface IapContextValue {
  isInitialized: boolean;
  isStoreReady: boolean;
  subscriptions: Product[];
  priceLabel: string | null;
  isSubscriptionResolved: boolean;
  isSubscriber: boolean;
  activeProductId: string | null;
  isLoading: boolean;
  isAwaitingOfferRedemption: boolean;
  errorMessage: string | null;
  promoErrorMessage: string | null;
  subscribe: (productId: string) => Promise<void>;
  redeemAppleOfferCode: () => Promise<boolean>;
  redeemAndroidPromoCode: (code: string) => Promise<boolean>;
  clearPromoError: () => void;
  restorePurchases: () => Promise<boolean>;
}
