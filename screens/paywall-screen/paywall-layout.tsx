import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "@/ui/scroll-view";
import { Divider } from "@/ui/divider";
import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Pressable } from "@/ui/pressable";

type PaywallLayoutProps = {
  priceLabel: string;
  subscribeButtonLabel: string;
  isSubscribeDisabled: boolean;
  isSubscriber: boolean;
  isProcessing: boolean;
  errorMessage: string | null;
  disclaimer: string;
  isRestoreDisabled: boolean;
  onSubscribe: () => void;
  onRestore: () => void;
  onManageSubscription: () => void;
  promo: ReactNode;
  overlay?: ReactNode;
};

export function PaywallLayout({
  priceLabel,
  subscribeButtonLabel,
  isSubscribeDisabled,
  isSubscriber,
  isProcessing,
  errorMessage,
  disclaimer,
  isRestoreDisabled,
  onSubscribe,
  onRestore,
  onManageSubscription,
  promo,
  overlay,
}: PaywallLayoutProps) {
  const { t } = useTranslation();

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
            <Text className="text-2xl font-bold mb-1">{priceLabel}</Text>
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
              isDisabled={isSubscribeDisabled}
              onPress={onSubscribe}
              className={`${
                isSubscriber
                  ? "bg-green-600 border-green-600"
                  : "bg-primary-600 border-primary-600"
              } mt-6 rounded-xl`}
            >
              <ButtonText>
                {isProcessing ? t("paywall.processing") : subscribeButtonLabel}
              </ButtonText>
            </Button>
            {promo}
          </Box>

          {errorMessage ? (
            <Text className="text-sm text-red-500 text-center">
              {errorMessage}
            </Text>
          ) : null}

          <HStack space="md" className="justify-center items-center">
            <Pressable
              onPress={onRestore}
              disabled={isRestoreDisabled}
              className="py-2"
            >
              <Text className="text-sm text-warmGray-500">
                {t("paywall.restore")}
              </Text>
            </Pressable>
            <Text className="text-sm text-warmGray-300">·</Text>
            <Pressable onPress={onManageSubscription} className="py-2">
              <Text className="text-sm text-warmGray-500">
                {t("common.manageSubscription")}
              </Text>
            </Pressable>
          </HStack>

          <Text className="text-xs text-warmGray-400 text-center">
            {disclaimer}
          </Text>
        </VStack>
      </ScrollView>
      {overlay}
    </Box>
  );
}
