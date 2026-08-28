import type { Product } from "expo-iap";

export interface IapContextValue {
  // connection
  isInitialized: boolean;
  isStoreReady: boolean;
  // catalog
  subscriptions: Product[];
  priceLabel: string | null;
  // entitlement
  isSubscriptionResolved: boolean;
  isSubscriber: boolean;
  activeProductId: string | null;
  isLoading: boolean;
  isAwaitingOfferRedemption: boolean;
  errorMessage: string | null;
  subscribe: (productId: string) => Promise<void>;
  redeemOfferCode: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
}


