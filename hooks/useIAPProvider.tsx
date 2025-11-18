import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useIAP as useExpoIAP, type Product, ErrorCode } from "expo-iap";
import type { IapContextValue } from "../types/iap";
import { SUBSCRIPTION_IDS } from "../config/iap";
import { AppEventsLogger } from "react-native-fbsdk-next";

const IapContext = createContext<IapContextValue | null>(null);

function sortByPrice(items: Product[]) {
  return [...items].sort((a, b) => {
    const ap = typeof a.price === "number" ? a.price : 0;
    const bp = typeof b.price === "number" ? b.price : 0;
    return ap - bp;
  });
}

export function IAPProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isSubscriptionResolved, setIsSubscriptionResolved] = useState(
    SUBSCRIPTION_IDS.length === 0
  );
  const [isStoreReady, setIsStoreReady] = useState(false);

  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    hasActiveSubscriptions,
  } = useExpoIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        await finishTransaction({ purchase, isConsumable: false });
        setActiveProductId(purchase.productId ?? null);
        setHasActiveSubscription(true);

        try {
          const product = products.find((p) => p.id === purchase.productId);
          if (product) {
            const price =
              typeof product.price === "number"
                ? product.price
                : typeof product.price === "string"
                ? parseFloat(product.price)
                : 0;
            const currency = product.currency || "USD";

            if (price > 0) {
              AppEventsLogger.logPurchase(price, currency);
              AppEventsLogger.logEvent("Subscribe", {
                value: price,
                currency: currency,
              });
            }
          }
        } catch (fbError) {}
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong")
        );
      }
    },
    onPurchaseError: (error) => {
      if (error?.code === ErrorCode.UserCancelled) return;
      setErrorMessage(
        error?.message ?? t("errors.generic", "Something went wrong")
      );
    },
  });

  const subscriptions = useMemo<Product[]>(
    () => sortByPrice(products),
    [products]
  );
  const priceLabel = subscriptions[0]?.displayPrice ?? null;
  const defaultProductId = subscriptions[0]?.id ?? SUBSCRIPTION_IDS[0] ?? null;
  const isInitialized = connected;
  const isLoading =
    isPurchasing || isFetchingProducts || isCheckingSubscription;
  const isSubscriber = hasActiveSubscription || activeProductId != null;

  // Debounce readiness 1 tick after connected to avoid races
  useEffect(() => {
    if (!connected) {
      setIsStoreReady(false);
      return;
    }
    const timer = setTimeout(() => setIsStoreReady(true), 0);
    return () => clearTimeout(timer);
  }, [connected]);

  // Fetch product catalog
  useEffect(() => {
    if (!isStoreReady || !SUBSCRIPTION_IDS.length) return;
    setIsFetchingProducts(true);
    (async () => {
      try {
        await fetchProducts({ skus: SUBSCRIPTION_IDS, type: "subs" });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong")
        );
      } finally {
        setIsFetchingProducts(false);
      }
    })();
  }, [isStoreReady, fetchProducts, t]);

  // Check entitlements with retry and unfiltered fallback
  useEffect(() => {
    if (!isStoreReady || !SUBSCRIPTION_IDS.length) return;
    let mounted = true;
    (async () => {
      setIsCheckingSubscription(true);
      try {
        // 1) Filtered by known SKU
        let hasActive = await hasActiveSubscriptions(SUBSCRIPTION_IDS);
        // 2) Unfiltered as safety net
        if (!hasActive) {
          hasActive = await hasActiveSubscriptions();
        }
        // 3) Retry once after short delay to handle post-init lag
        if (!hasActive) {
          await new Promise((r) => setTimeout(r, 500));
          hasActive =
            (await hasActiveSubscriptions(SUBSCRIPTION_IDS)) ||
            (await hasActiveSubscriptions());
        }
        if (!mounted) return;
        setHasActiveSubscription(hasActive);
        if (hasActive) {
          setActiveProductId((cur) => cur ?? defaultProductId ?? null);
        } else {
          setActiveProductId(null);
        }
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong")
        );
      } finally {
        if (mounted) {
          setIsCheckingSubscription(false);
          setIsSubscriptionResolved(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isStoreReady, hasActiveSubscriptions, defaultProductId, t]);

  const subscribe = async (productId: string) => {
    try {
      if (!isInitialized || !isStoreReady) {
        setErrorMessage(t("errors.generic", "Something went wrong"));
        return;
      }
      setIsPurchasing(true);
      await requestPurchase({
        request: {
          ios: { sku: productId },
          android: { skus: [productId] },
        },
        type: "subs",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong")
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const value: IapContextValue = {
    isInitialized,
    isStoreReady,
    subscriptions,
    priceLabel,
    isSubscriptionResolved,
    isSubscriber,
    activeProductId,
    isLoading,
    errorMessage,
    subscribe,
  };
  return <IapContext.Provider value={value}>{children}</IapContext.Provider>;
}

export function useIAP() {
  const ctx = useContext(IapContext);
  if (!ctx) throw new Error("useIAP must be used within IAPProvider");
  return ctx;
}
