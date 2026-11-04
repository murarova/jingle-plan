import { memo, useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useIAP } from "@/hooks/useIAP";
import { AndroidPaywall } from "./android-paywall";
import { IosPaywall } from "./ios-paywall";

export const PaywallScreen = memo(() => {
  const { t } = useTranslation();
  const { clearErrorMessage, errorMessage } = useIAP();

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    Alert.alert(t("common.error"), errorMessage);
    clearErrorMessage();
  }, [clearErrorMessage, errorMessage, t]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearErrorMessage();
      };
    }, [clearErrorMessage]),
  );

  if (Platform.OS === "android") {
    return <AndroidPaywall />;
  }
  return <IosPaywall />;
});

PaywallScreen.displayName = "PaywallScreen";
