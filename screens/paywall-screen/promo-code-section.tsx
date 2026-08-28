import { memo, useCallback } from "react";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "@/ui/button";
import { useIAP } from "@/hooks/useIAP";

export const PromoCodeSection = memo(() => {
  const { t } = useTranslation();
  const { isLoading, isInitialized, isStoreReady, isSubscriber, redeemOfferCode } =
    useIAP();

  const handleRedeem = useCallback(() => {
    void redeemOfferCode();
  }, [redeemOfferCode]);

  if (Platform.OS !== "ios" || isSubscriber) {
    return null;
  }

  return (
    <Button
      variant="outline"
      isDisabled={isLoading || !isInitialized || !isStoreReady}
      onPress={handleRedeem}
      className="mt-3 rounded-xl border-primary-600"
    >
      <ButtonText className="text-primary-600">
        {t("paywall.promoCta")}
      </ButtonText>
    </Button>
  );
});

PromoCodeSection.displayName = "PromoCodeSection";
