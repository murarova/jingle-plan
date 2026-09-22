import { useCallback } from "react";
import { Alert, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { EXPO_PUBLIC_IOS_SUBSCRIPTION_ID } from "@env";
import { useIAP } from "@/hooks/useIAP";

const MANAGE_SUBSCRIPTION_URL =
  "https://apps.apple.com/account/subscriptions";

export function useIosPaywall() {
  const { t } = useTranslation();
  const {
    subscriptions,
    isLoading,
    subscribe,
    activeProductId,
    isInitialized,
    priceLabel,
    isSubscriber,
    isStoreReady,
    errorMessage,
    restorePurchases,
    isAwaitingOfferRedemption,
    redeemAppleOfferCode,
  } = useIAP();

  const productId = subscriptions[0]?.id ?? EXPO_PUBLIC_IOS_SUBSCRIPTION_ID ?? "";
  const canUseStore = isInitialized && isStoreReady;

  const handleSubscribe = useCallback(() => {
    if (productId) {
      subscribe(productId);
    }
  }, [productId, subscribe]);

  const handleManageSubscription = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(MANAGE_SUBSCRIPTION_URL);
      if (supported) {
        await Linking.openURL(MANAGE_SUBSCRIPTION_URL);
      } else {
        throw new Error("Unsupported URL");
      }
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [t]);

  const handleRestorePurchases = useCallback(async () => {
    try {
      const restored = await restorePurchases();
      Alert.alert(
        t("paywall.restore"),
        restored ? t("paywall.restoreSuccess") : t("paywall.restoreEmpty"),
      );
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [restorePurchases, t]);

  const handleRedeemPromo = useCallback(() => {
    void redeemAppleOfferCode();
  }, [redeemAppleOfferCode]);

  return {
    priceLabel: priceLabel ?? t("paywall.pricePlaceholder"),
    subscribeButtonLabel:
      productId && activeProductId === productId
        ? t("paywall.alreadySubscribed")
        : t("paywall.cta"),
    isSubscribeDisabled: isLoading || !productId || !canUseStore,
    isSubscriber,
    isProcessing: isLoading,
    errorMessage,
    disclaimer: t("paywall.disclaimer"),
    isRestoreDisabled: isLoading || !canUseStore,
    showRedeemOverlay: isAwaitingOfferRedemption,
    isPromoDisabled: isLoading || !canUseStore,
    onSubscribe: handleSubscribe,
    onRestore: handleRestorePurchases,
    onManageSubscription: handleManageSubscription,
    onRedeemPromo: handleRedeemPromo,
  };
}
