import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useIAP as useExpoIAP,
  type Product,
  ErrorCode,
  presentCodeRedemptionSheetIOS,
} from "expo-iap";
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
  const catalogRef = useRef<Product[]>([]);
  const awaitingOfferRef = useRef(false);
  const [isAwaitingOfferRedemption, setIsAwaitingOfferRedemption] =
    useState(false);

  const stopAwaitingOffer = useCallback(() => {
    awaitingOfferRef.current = false;
    setIsAwaitingOfferRedemption(false);
  }, []);

  const {
    connected,
    products,
    subscriptions: storeSubscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    hasActiveSubscriptions,
    restorePurchases: restorePurchasesFromStore,
  } = useExpoIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        await finishTransaction({ purchase, isConsumable: false });
        setActiveProductId(purchase.productId ?? null);
        setHasActiveSubscription(true);
        stopAwaitingOffer();

        try {
          const product = catalogRef.current.find(
            (item) => item.id === purchase.productId
          );
          if (product) {
            const price =
              typeof product.price === "number"
                ? product.price
                : typeof product.price === "string"
                ? parseFloat(product.price)
                : 0;
            const currency = product.currency || "USD";

            if (price > 0) {
              try {
                AppEventsLogger.logPurchase(price, currency);
                AppEventsLogger.logEvent("Subscribe", {
                  value: price,
                  currency: currency,
                });
              } catch (fbError) {
                console.log(
                  "Failed to log Facebook purchase event:",
                  fbError
                );
              }
            }
          }
        } catch (fbError) {
          console.log("Error logging Facebook events:", fbError);
        }
      } catch (error) {
        stopAwaitingOffer();
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong")
        );
      }
    },
    onPurchaseError: (error) => {
      stopAwaitingOffer();
      if (error?.code === ErrorCode.UserCancelled) return;
      setErrorMessage(
        error?.message ?? t("errors.generic", "Something went wrong")
      );
    },
  });

  const subscriptions = useMemo<Product[]>(() => {
    const catalog =
      storeSubscriptions.length > 0 ? storeSubscriptions : products;
    return sortByPrice(catalog as Product[]);
  }, [storeSubscriptions, products]);
  catalogRef.current = subscriptions;
  const priceLabel = subscriptions[0]?.displayPrice ?? null;
  const defaultProductId = subscriptions[0]?.id ?? SUBSCRIPTION_IDS[0] ?? null;
  const isInitialized = connected;
  const isLoading =
    isPurchasing ||
    isFetchingProducts ||
    isCheckingSubscription ||
    isAwaitingOfferRedemption;
  const isSubscriber = hasActiveSubscription || activeProductId != null;

  useEffect(() => {
    if (!connected) {
      setIsStoreReady(false);
      return;
    }
    const timer = setTimeout(() => setIsStoreReady(true), 0);
    return () => clearTimeout(timer);
  }, [connected]);

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

  const refreshEntitlements = useCallback(async (silent = false): Promise<boolean> => {
    if (!isStoreReady || !SUBSCRIPTION_IDS.length) {
      return false;
    }
    if (!silent) {
      setIsCheckingSubscription(true);
    }
    try {
      let hasActive = await hasActiveSubscriptions(SUBSCRIPTION_IDS);
      if (!hasActive) {
        hasActive = await hasActiveSubscriptions();
      }
      if (!hasActive) {
        await new Promise((r) => setTimeout(r, 500));
        hasActive =
          (await hasActiveSubscriptions(SUBSCRIPTION_IDS)) ||
          (await hasActiveSubscriptions());
      }
      setHasActiveSubscription(hasActive);
      if (hasActive) {
        setActiveProductId((cur) => cur ?? defaultProductId ?? null);
        stopAwaitingOffer();
      } else {
        setActiveProductId(null);
      }
      return hasActive;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong")
      );
      return false;
    } finally {
      if (!silent) {
        setIsCheckingSubscription(false);
      }
      setIsSubscriptionResolved(true);
    }
  }, [isStoreReady, hasActiveSubscriptions, defaultProductId, stopAwaitingOffer, t]);

  useEffect(() => {
    if (!isStoreReady || !SUBSCRIPTION_IDS.length) return;
    void refreshEntitlements();
  }, [isStoreReady, refreshEntitlements]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          void refreshEntitlements();
        }
      }
    );
    return () => subscription.remove();
  }, [refreshEntitlements]);

  const subscribe = useCallback(
    async (productId: string) => {
      try {
        if (!isInitialized || !isStoreReady) {
          setErrorMessage(t("errors.generic", "Something went wrong"));
          return;
        }
        setErrorMessage(null);
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
    },
    [isInitialized, isStoreReady, requestPurchase, t]
  );

  const redeemOfferCode = useCallback(async () => {
    try {
      if (Platform.OS !== "ios") {
        return;
      }
      if (!isInitialized || !isStoreReady) {
        setErrorMessage(t("errors.generic", "Something went wrong"));
        return;
      }
      setErrorMessage(null);
      awaitingOfferRef.current = true;
      setIsAwaitingOfferRedemption(true);
      await presentCodeRedemptionSheetIOS();
      const deadline = Date.now() + 12000;
      while (awaitingOfferRef.current && Date.now() < deadline) {
        const hasActive = await refreshEntitlements(true);
        if (hasActive) {
          break;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong")
      );
    } finally {
      stopAwaitingOffer();
    }
  }, [isInitialized, isStoreReady, refreshEntitlements, stopAwaitingOffer, t]);

  const restorePurchases = useCallback(async () => {
    try {
      if (!isInitialized || !isStoreReady) {
        setErrorMessage(t("errors.generic", "Something went wrong"));
        return false;
      }
      setErrorMessage(null);
      setIsPurchasing(true);
      await restorePurchasesFromStore();
      return await refreshEntitlements();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong")
      );
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [
    isInitialized,
    isStoreReady,
    refreshEntitlements,
    restorePurchasesFromStore,
    t,
  ]);

  const value: IapContextValue = {
    isInitialized,
    isStoreReady,
    subscriptions,
    priceLabel,
    isSubscriptionResolved,
    isSubscriber,
    activeProductId,
    isLoading,
    isAwaitingOfferRedemption,
    errorMessage,
    subscribe,
    redeemOfferCode,
    restorePurchases,
  };
  return <IapContext.Provider value={value}>{children}</IapContext.Provider>;
}

export function useIAP() {
  const ctx = useContext(IapContext);
  if (!ctx) throw new Error("useIAP must be used within IAPProvider");
  return ctx;
}
