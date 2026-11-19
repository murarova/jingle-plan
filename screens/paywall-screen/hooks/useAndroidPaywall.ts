import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID } from "@env";
import { useIAP } from "@/hooks/useIAP";
import {
  GOOGLE_PLAY_PAYWALL_ENABLED,
  WEBSITE_SUBSCRIBE_PRICE,
  WEBSITE_SUBSCRIBE_URL,
} from "@/constants/paywall";

const MANAGE_SUBSCRIPTION_URL =
  "https://play.google.com/store/account/subscriptions";

export function useAndroidPaywall() {
  const { t } = useTranslation();
  const {
    subscriptions,
    isLoading,
    subscribe,
    isInitialized,
    priceLabel,
    isSubscriber,
    activeProductId,
    isStoreReady,
    restorePurchases,
    redeemAndroidPromoCode,
    clearPromoError,
  } = useIAP();

  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const productId =
    subscriptions[0]?.id ?? EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID ?? "";
  const canUseStore = isInitialized && isStoreReady;

  const handleSubscribe = useCallback(() => {
    if (!GOOGLE_PLAY_PAYWALL_ENABLED) {
      Linking.openURL(WEBSITE_SUBSCRIBE_URL).catch(() => {
        Alert.alert(t("common.error"), t("errors.generic"));
      });
      return;
    }
    if (productId) {
      subscribe(productId);
    }
  }, [productId, subscribe, t]);

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
    } catch (error) {
      Alert.alert(
        t("common.error"),
        error instanceof Error ? error.message : t("errors.generic"),
      );
    } finally {
      setIsRedeeming(false);
    }
  }, [code, redeemAndroidPromoCode, t]);

  const showStoreBilling =
    GOOGLE_PLAY_PAYWALL_ENABLED &&
    (!isSubscriber || activeProductId != null);

  return {
    priceLabel: GOOGLE_PLAY_PAYWALL_ENABLED
      ? showStoreBilling
        ? (priceLabel ?? "")
        : ""
      : isSubscriber
        ? ""
        : WEBSITE_SUBSCRIBE_PRICE,
    isSubscribeDisabled:
      GOOGLE_PLAY_PAYWALL_ENABLED &&
      (isLoading || !productId || !canUseStore),
    isSubscriber,
    isProcessing: GOOGLE_PLAY_PAYWALL_ENABLED && isLoading,
    billingNote: showStoreBilling ? t("paywall.billingNoteAndroid") : null,
    isRestoreDisabled: isLoading,
    isPromoDisabled: isLoading,
    promoCode: code,
    isPromoModalOpen: isModalOpen,
    isRedeemingPromo: isRedeeming,
    onChangePromoCode: setCode,
    showManageSubscription: showStoreBilling,
    showStorePurchase: true,
    websiteSubscribeUrl:
      GOOGLE_PLAY_PAYWALL_ENABLED || isSubscriber
        ? null
        : WEBSITE_SUBSCRIBE_URL,
    onSubscribe: handleSubscribe,
    onRestore: handleRestorePurchases,
    onManageSubscription: handleManageSubscription,
    onOpenPromoModal: handleOpenPromoModal,
    onClosePromoModal: handleClosePromoModal,
    onRedeemPromo: handleRedeemPromo,
  };
}
