import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID } from "@env";
import { useIAP } from "@/hooks/useIAP";

const MANAGE_SUBSCRIPTION_URL =
  "https://play.google.com/store/account/subscriptions";

export function useAndroidPaywall() {
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
    redeemAndroidPromoCode,
    clearPromoError,
    promoErrorMessage,
  } = useIAP();

  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const productId =
    subscriptions[0]?.id ?? EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID ?? "";
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

  const handleOpenPromoModal = useCallback(() => {
    clearPromoError();
    setIsModalOpen(true);
  }, [clearPromoError]);

  const handleClosePromoModal = useCallback(() => {
    setIsModalOpen(false);
    setCode("");
    setIsRedeeming(false);
    clearPromoError();
  }, [clearPromoError]);

  const handleRedeemPromo = useCallback(async () => {
    setIsRedeeming(true);
    try {
      const redeemed = await redeemAndroidPromoCode(code);
      if (redeemed) {
        setIsModalOpen(false);
        setCode("");
      }
    } finally {
      setIsRedeeming(false);
    }
  }, [code, redeemAndroidPromoCode]);

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
    disclaimer: t("paywall.disclaimerAndroid"),
    isRestoreDisabled: isLoading,
    isPromoDisabled: isLoading,
    promoCode: code,
    isPromoModalOpen: isModalOpen,
    isRedeemingPromo: isRedeeming,
    promoErrorMessage,
    onChangePromoCode: setCode,
    onSubscribe: handleSubscribe,
    onRestore: handleRestorePurchases,
    onManageSubscription: handleManageSubscription,
    onOpenPromoModal: handleOpenPromoModal,
    onClosePromoModal: handleClosePromoModal,
    onRedeemPromo: handleRedeemPromo,
  };
}
