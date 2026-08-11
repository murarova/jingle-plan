import { ScrollView } from "@/ui/scroll-view";
import { Divider } from "@/ui/divider";
import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useIAP } from "../../hooks/useIAP";
import {
  EXPO_PUBLIC_IOS_SUBSCRIPTION_ID,
  EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID,
} from "@env";
import { Alert, Linking, Platform } from "react-native";

const MANAGE_SUBSCRIPTION_URL_IOS =
  "https://apps.apple.com/account/subscriptions";
const MANAGE_SUBSCRIPTION_URL_ANDROID =
  "https://play.google.com/store/account/subscriptions";

export const PaywallScreen = memo(() => {
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
  } = useIAP();
  const fallbackProductId =
    Platform.OS === "android"
      ? EXPO_PUBLIC_ANDROID_SUBSCRIPTION_ID || ""
      : EXPO_PUBLIC_IOS_SUBSCRIPTION_ID || "";
  const resolvedProductId = subscriptions[0]?.id ?? fallbackProductId;
  const displayedPrice = priceLabel ?? t("paywall.pricePlaceholder");
  const subscribeButtonLabel =
    resolvedProductId && activeProductId === resolvedProductId
      ? t("paywall.alreadySubscribed")
      : t("paywall.cta");

  const handleManageSubscription = useCallback(async () => {
    try {
      const manageSubscriptionUrl =
        Platform.OS === "android"
          ? MANAGE_SUBSCRIPTION_URL_ANDROID
          : MANAGE_SUBSCRIPTION_URL_IOS;

      const supported = await Linking.canOpenURL(manageSubscriptionUrl);
      if (supported) {
        await Linking.openURL(manageSubscriptionUrl);
      } else {
        throw new Error("Unsupported URL");
      }
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [t]);

  return (
    <Box className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Box className="mb-6">
          <Text className="text-xl font-bold mb-1">{t("paywall.title")}</Text>
          <Text className="text-md text-warmGray-500">
            {t("paywall.subtitle")}
          </Text>
        </Box>

        <VStack space="md">
          <Box className="border border-warmGray-200 rounded-2xl p-5 bg-white">
            <Text className="text-lg font-semibold mb-2">
              {t("paywall.planName")}
            </Text>
            <Text className="text-2xl font-bold mb-1">{displayedPrice}</Text>
            <Text className="text-sm text-warmGray-500 mb-4">
              {t("paywall.billingPeriod")}
            </Text>
            <Divider className="my-2" />
            <VStack space="xs" className="mt-3">
              <HStack space="sm" className="mb-2">
                <Text>•</Text>
                <Text className="flex-1">{t("paywall.benefitOne")}</Text>
              </HStack>
              <HStack space="sm" className="mb-2">
                <Text>•</Text>
                <Text className="flex-1">{t("paywall.benefitFour")}</Text>
              </HStack>
              <HStack space="sm" className="mb-2">
                <Text>•</Text>
                <Text className="flex-1">{t("paywall.benefitThree")}</Text>
              </HStack>
              <HStack space="sm" className="mb-2">
                <Text>•</Text>
                <Text className="flex-1">{t("paywall.benefitTwo")}</Text>
              </HStack>
            </VStack>
            <Button
              isDisabled={
                isLoading ||
                !resolvedProductId ||
                !isInitialized ||
                !isStoreReady
              }
              onPress={() => {
                if (resolvedProductId) {
                  subscribe(resolvedProductId);
                }
              }}
              className={`${
                isSubscriber
                  ? "bg-green-600 border-green-600"
                  : "bg-primary-600 border-primary-600"
              } mt-6 rounded-xl`}
            >
              <ButtonText>
                {isLoading ? t("paywall.processing") : subscribeButtonLabel}
              </ButtonText>
            </Button>
          </Box>

          <Button variant="link" onPress={handleManageSubscription}>
            <ButtonText className="text-primary-600">
              {t("common.manageSubscription")}
            </ButtonText>
          </Button>

          <Text className="text-xs text-warmGray-500">
            {t(
              Platform.OS === "android"
                ? "paywall.disclaimerAndroid"
                : "paywall.disclaimer",
            )}
          </Text>
        </VStack>
      </ScrollView>
    </Box>
  );
});

PaywallScreen.displayName = "PaywallScreen";
