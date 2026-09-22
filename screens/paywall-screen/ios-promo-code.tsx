import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "@/ui/button";

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
      <Button
        variant="outline"
        isDisabled={isDisabled}
        onPress={onRedeem}
        className="mt-3 rounded-xl border-primary-600"
      >
        <ButtonText className="text-primary-600">
          {t("paywall.promoCta")}
        </ButtonText>
      </Button>
    );
  },
);

IosPromoCode.displayName = "IosPromoCode";
