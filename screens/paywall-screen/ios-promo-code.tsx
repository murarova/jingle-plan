import { memo } from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components/common";

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
      <AppButton
        variant="secondary"
        label={t("paywall.promoCta")}
        onPress={onRedeem}
        isDisabled={isDisabled}
        className="mt-3"
      />
    );
  },
);

IosPromoCode.displayName = "IosPromoCode";
