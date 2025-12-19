import { memo, useCallback } from "react";
import {
  Box,
  SafeAreaView,
  Text,
  Button,
  ButtonText,
  VStack,
  HStack,
  Divider,
  ScrollView,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { useIAP } from "../hooks/useIAP";
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
    <SafeAreaView flex={1} backgroundColor="$white">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Box mb="$6">
          <Text fontSize="$xl" fontWeight="$bold" mb="$1">
            {t("paywall.title")}
          </Text>
          <Text fontSize="$md" color="$warmGray500">
            {t("paywall.subtitle")}
          </Text>
        </Box>

        <VStack space="md">
          <Box
            borderWidth={1}
            borderColor="$warmGray200"
            borderRadius="$2xl"
            p="$5"
            backgroundColor="$white"
          >
            <Text fontSize="$lg" fontWeight="$semibold" mb="$2">
              {t("paywall.planName")}
            </Text>
            <Text fontSize="$2xl" fontWeight="$bold" mb="$1">
              {displayedPrice}
            </Text>
            <Text fontSize="$sm" color="$warmGray500" mb="$4">
              {t("paywall.billingPeriod")}
            </Text>
            <Divider my="$2" />
            <VStack space="xs" mt="$3">
              <HStack space="sm" mb="$2">
                <Text>•</Text>
                <Text flex={1}>{t("paywall.benefitOne")}</Text>
              </HStack>
              <HStack space="sm" mb="$2">
                <Text>•</Text>
                <Text flex={1}>{t("paywall.benefitFour")}</Text>
              </HStack>
              <HStack space="sm" mb="$2">
                <Text>•</Text>
                <Text flex={1}>{t("paywall.benefitThree")}</Text>
              </HStack>
              <HStack space="sm" mb="$2">
                <Text>•</Text>
                <Text flex={1}>{t("paywall.benefitTwo")}</Text>
              </HStack>
            </VStack>
            <Button
              mt="$6"
              borderRadius="$xl"
              bgColor={isSubscriber ? "$green600" : "$primary600"}
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
            >
              <ButtonText>
                {isLoading ? t("paywall.processing") : subscribeButtonLabel}
              </ButtonText>
            </Button>
          </Box>

          <Button variant="link" onPress={handleManageSubscription}>
            <ButtonText color="$primary600">
              {t("common.manageSubscription")}
            </ButtonText>
          </Button>

          <Text fontSize="$xs" color="$warmGray500">
            {t(
              Platform.OS === "android"
                ? "paywall.disclaimerAndroid"
                : "paywall.disclaimer"
            )}
          </Text>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
});

PaywallScreen.displayName = "PaywallScreen";
