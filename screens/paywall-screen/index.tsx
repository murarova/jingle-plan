import { memo, useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useIAP } from "@/hooks/useIAP";
import { PAYWALL_PLACEMENTS } from "@/constants/analytics";
import { trackPaywallView } from "@/services/analytics";
import type { RootStackParamList } from "@/navigation/types";
import { AndroidPaywall } from "./android-paywall";
import { IosPaywall } from "./ios-paywall";

export const PaywallScreen = memo(() => {
  const { t } = useTranslation();
  const { clearErrorMessage, errorMessage } = useIAP();
  const route = useRoute<RouteProp<RootStackParamList, "Paywall">>();
  const placement = route.params?.placement ?? PAYWALL_PLACEMENTS.APP_MENU;

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    Alert.alert(t("common.error"), errorMessage);
    clearErrorMessage();
  }, [clearErrorMessage, errorMessage, t]);

  useFocusEffect(
    useCallback(() => {
      trackPaywallView(placement);
      return () => {
        clearErrorMessage();
      };
    }, [clearErrorMessage, placement]),
  );

  if (Platform.OS === "android") {
    return <AndroidPaywall />;
  }
  return <IosPaywall />;
});

PaywallScreen.displayName = "PaywallScreen";
