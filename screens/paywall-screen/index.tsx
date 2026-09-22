import { memo } from "react";
import { Platform } from "react-native";
import { AndroidPaywall } from "./android-paywall";
import { IosPaywall } from "./ios-paywall";

export const PaywallScreen = memo(() => {
  if (Platform.OS === "android") {
    return <AndroidPaywall />;
  }
  return <IosPaywall />;
});

PaywallScreen.displayName = "PaywallScreen";
