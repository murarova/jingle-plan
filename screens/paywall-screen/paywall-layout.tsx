import type { ReactNode } from "react";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { CircleCheck, Sparkles } from "lucide-react-native";
import { ScrollView } from "@/ui/scroll-view";
import { AppButton } from "@/components/common";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { colors } from "@/constants/colors";
import { PRIVACY_URL, TERMS_URL } from "@/constants/legal";
import { typeRole } from "@/constants/typography";
import { PaywallBenefits } from "./paywall-benefits";
import { PaywallLink } from "./paywall-link";

type PaywallLayoutProps = {
  priceLabel: string;
  isSubscribeDisabled: boolean;
  isSubscriber: boolean;
  isProcessing: boolean;
  billingNote: string;
  isRestoreDisabled: boolean;
  onSubscribe: () => void;
  onRestore: () => void;
  onManageSubscription: () => void;
  promo: ReactNode;
  overlay?: ReactNode;
};

export function PaywallLayout({
  priceLabel,
  isSubscribeDisabled,
  isSubscriber,
  isProcessing,
  billingNote,
  isRestoreDisabled,
  onSubscribe,
  onRestore,
  onManageSubscription,
  promo,
  overlay,
}: PaywallLayoutProps) {
  const { t } = useTranslation();
  const legalLinks = [
    { key: "terms", label: t("paywall.terms"), url: TERMS_URL },
    { key: "privacy", label: t("paywall.privacy"), url: PRIVACY_URL },
  ].filter((link) => link.url);

  return (
    <Box className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Box className="items-center gap-2 pb-5 pt-2">
          <Box className="flex-row items-center gap-2">
            <Sparkles size={16} color={colors.progressYellow} />
            <Text
              className={`${typeRole.supporting} font-semibold uppercase`}
              style={{ color: colors.progressYellow, letterSpacing: 1 }}
            >
              {t("paywall.eyebrow")}
            </Text>
            <Sparkles size={16} color={colors.progressYellow} />
          </Box>
          <Text className={`${typeRole.body} text-center text-secondaryText`}>
            {t("paywall.lead")}
          </Text>
        </Box>

        <PaywallBenefits />

        <Box
          className="mt-4 w-full gap-2 rounded-3xl border-[1.5px] bg-ivory-card p-4"
          style={{ borderColor: colors.green400 }}
        >
          <Box className="flex-row items-center justify-between">
            <Text className={`${typeRole.button} text-primaryText`}>
              {t("paywall.planTitle")}
            </Text>
            <CircleCheck size={20} color={colors.green400} />
          </Box>
          {priceLabel ? (
            <Box className="flex-row items-baseline gap-1.5">
              <Text
                className="text-primaryText"
                style={{ fontSize: 30, lineHeight: 36, fontWeight: "700" }}
              >
                {priceLabel}
              </Text>
              <Text className={`${typeRole.secondary} text-secondaryText`}>
                {t("paywall.perYear")}
              </Text>
            </Box>
          ) : null}
          <Text
            className={`${typeRole.supporting} text-secondaryText`}
            style={{ fontSize: 12, lineHeight: 16 }}
          >
            {billingNote}
          </Text>
          {isSubscriber ? (
            <Box
              className="mt-1 flex-row items-center justify-center gap-2 rounded-[14px] py-2.5"
              style={{ backgroundColor: `${colors.green400}26` }}
            >
              <CircleCheck size={18} color={colors.green400} />
              <Text className={`${typeRole.button} text-primaryText`}>
                {t("paywall.alreadySubscribed")}
              </Text>
            </Box>
          ) : null}
        </Box>

        {!isSubscriber ? (
          <AppButton
            label={isProcessing ? t("paywall.processing") : t("paywall.cta")}
            onPress={onSubscribe}
            isDisabled={isSubscribeDisabled}
            className="mt-4 h-[42px]"
          />
        ) : null}
        {promo}

        <Box className="mt-1 flex-row items-center justify-center gap-2">
          <PaywallLink
            label={t("paywall.restore")}
            onPress={onRestore}
            disabled={isRestoreDisabled}
          />
          <Text className={`${typeRole.supporting} text-secondaryText`}>·</Text>
          <PaywallLink
            label={t("common.manageSubscription")}
            onPress={onManageSubscription}
          />
        </Box>

        {legalLinks.length > 0 ? (
          <Box className="mt-1 flex-row items-center justify-center gap-2">
            {legalLinks.map((link) => (
              <PaywallLink
                key={link.key}
                label={link.label}
                onPress={() => {
                  Linking.openURL(link.url).catch(() => {});
                }}
              />
            ))}
          </Box>
        ) : null}
      </ScrollView>
      {overlay}
    </Box>
  );
}
