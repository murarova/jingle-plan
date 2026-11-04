import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@/ui/box";
import { PaywallLink } from "./paywall-link";

type IosPromoCodeProps = {
  isDisabled: boolean;
  isSubscriber: boolean;
  onRedeem: () => void;
};

export const IosPromoCode = memo(
  ({ isDisabled, isSubscriber, onRedeem }: IosPromoCodeProps) => {
    const { t } = useTranslation();

    if (isSubscriber) {
      return null;
    }

    return (
      <Box className="mt-3 items-center">
        <PaywallLink
          label={t("paywall.promoCta")}
          onPress={onRedeem}
          disabled={isDisabled}
          emphasized
        />
      </Box>
    );
  },
);

IosPromoCode.displayName = "IosPromoCode";
