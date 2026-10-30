import { memo, useCallback } from "react";
import { Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useIAP } from "@/hooks/useIAP";
import { AndroidPaywall } from "./android-paywall";
import { IosPaywall } from "./ios-paywall";

export const PaywallScreen = memo(() => {
  const { clearErrorMessage } = useIAP();

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
