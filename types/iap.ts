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
  // inflight
  isLoading: boolean;
  // error
  errorMessage: string | null;
  // actions
  subscribe: (productId: string) => Promise<void>;
}


