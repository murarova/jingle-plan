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
import { skipStoreIap, SUBSCRIPTION_IDS } from "../config/iap";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import {
  getAndroidPromoEntitlement,
  PromoRedeemError,
  redeemAndroidPromoCode as requestAndroidPromoRedeem,
} from "../services/android-promo";
import {
  computeIsSubscriber,
  isPromoEntitlementActive,
  nextPromoExpiresAt,
  shouldResolveWithoutStoreCheck,
} from "../utils/iap-entitlement";
import { getStorePriceLabel } from "../utils/iap-price";

const IapContext = createContext<IapContextValue | null>(null);

function sortByPrice(items: Product[]) {
  return [...items].sort((a, b) => {
    const ap = typeof a.price === "number" ? a.price : 0;
    const bp = typeof b.price === "number" ? b.price : 0;
    return ap - bp;
  });
}

function LocalIAPProvider({ children }: { children: React.ReactNode }) {
  const value: IapContextValue = useMemo(
    () => ({
      isInitialized: false,
      isStoreReady: false,
      subscriptions: [],
      priceLabel: null,
      isSubscriptionResolved: true,
      isSubscriber: false,
      activeProductId: null,
      isLoading: false,
      isAwaitingOfferRedemption: false,
      errorMessage: null,
      promoErrorMessage: null,
      subscribe: async () => {},
      redeemAppleOfferCode: async () => false,
      redeemAndroidPromoCode: async () => false,
      clearPromoError: () => {},
      restorePurchases: async () => false,
    }),
    [],
  );

  return <IapContext.Provider value={value}>{children}</IapContext.Provider>;
}

function StoreIAPProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [promoErrorMessage, setPromoErrorMessage] = useState<string | null>(
    null,
  );
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [promoExpiresAt, setPromoExpiresAt] = useState<number | null>(null);

  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isSubscriptionResolved, setIsSubscriptionResolved] = useState(
    SUBSCRIPTION_IDS.length === 0,
  );
  const [isStoreReady, setIsStoreReady] = useState(false);
  const catalogRef = useRef<Product[]>([]);
  const promoExpiresAtRef = useRef<number | null>(null);
  const awaitingOfferRef = useRef(false);
  const [isAwaitingOfferRedemption, setIsAwaitingOfferRedemption] =
    useState(false);
  promoExpiresAtRef.current = promoExpiresAt;

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
    onError: () => {
      setIsSubscriptionResolved(true);
    },
    onPurchaseSuccess: async (purchase) => {
      try {
        await finishTransaction({ purchase, isConsumable: false });
        setActiveProductId(purchase.productId ?? null);
        setHasActiveSubscription(true);
        stopAwaitingOffer();

        try {
          const product = catalogRef.current.find(
            (item) => item.id === purchase.productId,
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
                console.log("Failed to log Facebook purchase event:", fbError);
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
            : t("errors.generic", "Something went wrong"),
        );
      }
    },
    onPurchaseError: (error) => {
      stopAwaitingOffer();
      if (error?.code === ErrorCode.UserCancelled) return;
      setErrorMessage(
        error?.message ?? t("errors.generic", "Something went wrong"),
      );
    },
  });

  const subscriptions = useMemo<Product[]>(() => {
    const catalog =
      storeSubscriptions.length > 0 ? storeSubscriptions : products;
    return sortByPrice(catalog as Product[]);
  }, [storeSubscriptions, products]);
  catalogRef.current = subscriptions;
  const priceLabel = getStorePriceLabel(subscriptions[0]);
  const defaultProductId = subscriptions[0]?.id ?? SUBSCRIPTION_IDS[0] ?? null;
  const isInitialized = connected;
  const isLoading =
    isPurchasing ||
    isFetchingProducts ||
    isCheckingSubscription ||
    isAwaitingOfferRedemption;
  const isSubscriber = computeIsSubscriber({
    hasActiveSubscription,
    activeProductId,
    promoExpiresAt,
  });

  useEffect(() => {
    if (!connected) {
      setIsStoreReady(false);
      return;
    }
    setIsStoreReady(true);
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
            : t("errors.generic", "Something went wrong"),
        );
      } finally {
        setIsFetchingProducts(false);
      }
    })();
  }, [isStoreReady, fetchProducts, t]);

  const refreshPromoEntitlement = useCallback(async (): Promise<
    number | null
  > => {
    if (Platform.OS !== "android") {
      return null;
    }
    try {
      const lookup = await getAndroidPromoEntitlement();
      const next = nextPromoExpiresAt(promoExpiresAtRef.current, lookup);
      setPromoExpiresAt(next);
      promoExpiresAtRef.current = next;
      return next;
    } catch {
      return promoExpiresAtRef.current;
    }
  }, []);

  const refreshEntitlements = useCallback(
    async (silent = false): Promise<boolean> => {
      if (!silent) {
        setIsCheckingSubscription(true);
      }
      try {
        const promoExpires = await refreshPromoEntitlement();
        const promoActive = isPromoEntitlementActive(promoExpires);

        if (!isStoreReady || !SUBSCRIPTION_IDS.length) {
          if (
            shouldResolveWithoutStoreCheck({
              hasSubscriptionIds: SUBSCRIPTION_IDS.length > 0,
              promoActive,
            })
          ) {
            setIsSubscriptionResolved(true);
          }
          return promoActive;
        }

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
        setIsSubscriptionResolved(true);
        return hasActive || promoActive;
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong"),
        );
        if (isStoreReady && SUBSCRIPTION_IDS.length > 0) {
          setIsSubscriptionResolved(true);
        }
        return false;
      } finally {
        if (!silent) {
          setIsCheckingSubscription(false);
        }
      }
    },
    [
      isStoreReady,
      hasActiveSubscriptions,
      defaultProductId,
      stopAwaitingOffer,
      refreshPromoEntitlement,
      t,
    ],
  );

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {
      void refreshEntitlements(true);
    });
    return unsubscribe;
  }, [refreshEntitlements]);

  useEffect(() => {
    void refreshEntitlements();
  }, [isStoreReady, refreshEntitlements]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          void refreshEntitlements();
        }
      },
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
            : t("errors.generic", "Something went wrong"),
        );
      } finally {
        setIsPurchasing(false);
      }
    },
    [isInitialized, isStoreReady, requestPurchase, t],
  );

  const redeemAppleOfferCode = useCallback(async () => {
    if (Platform.OS !== "ios") {
      return false;
    }
    try {
      if (!isInitialized || !isStoreReady) {
        setErrorMessage(t("errors.generic", "Something went wrong"));
        return false;
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
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong"),
      );
      return false;
    } finally {
      stopAwaitingOffer();
    }
  }, [isInitialized, isStoreReady, refreshEntitlements, stopAwaitingOffer, t]);

  const redeemAndroidPromoCode = useCallback(
    async (code: string) => {
      if (Platform.OS !== "android") {
        return false;
      }
      try {
        setErrorMessage(null);
        setPromoErrorMessage(null);
        const expiresAt = await requestAndroidPromoRedeem(code);
        setPromoExpiresAt(expiresAt);
        promoExpiresAtRef.current = expiresAt;
        return true;
      } catch (error) {
        if (error instanceof PromoRedeemError) {
          const messageKey =
            error.code === "unknown_code" || error.code === "invalid_code"
              ? "paywall.promoInvalid"
              : error.code === "already_used"
                ? "paywall.promoUsed"
                : error.code === "already_redeemed"
                  ? "paywall.promoAlreadyRedeemed"
                  : "errors.generic";
          setPromoErrorMessage(t(messageKey));
          return false;
        }
        setPromoErrorMessage(
          error instanceof Error
            ? error.message
            : t("errors.generic", "Something went wrong"),
        );
        return false;
      }
    },
    [t],
  );

  const clearPromoError = useCallback(() => {
    setPromoErrorMessage(null);
  }, []);

  const restorePurchases = useCallback(async () => {
    const canUseStore = isInitialized && isStoreReady;
    if (!canUseStore && Platform.OS !== "android") {
      setErrorMessage(t("errors.generic", "Something went wrong"));
      return false;
    }
    setErrorMessage(null);
    setIsPurchasing(true);
    try {
      if (canUseStore) {
        try {
          await restorePurchasesFromStore();
        } catch (error) {
          if (Platform.OS !== "android") {
            throw error;
          }
        }
      }
      return await refreshEntitlements();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("errors.generic", "Something went wrong"),
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
    promoErrorMessage,
    subscribe,
    redeemAppleOfferCode,
    redeemAndroidPromoCode,
    clearPromoError,
    restorePurchases,
  };
  return <IapContext.Provider value={value}>{children}</IapContext.Provider>;
}

export function IAPProvider({ children }: { children: React.ReactNode }) {
  if (skipStoreIap) {
    return <LocalIAPProvider>{children}</LocalIAPProvider>;
  }
  return <StoreIAPProvider>{children}</StoreIAPProvider>;
}

export function useIAP() {
  const ctx = useContext(IapContext);
  if (!ctx) throw new Error("useIAP must be used within IAPProvider");
  return ctx;
}
