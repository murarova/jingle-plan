import { memo } from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components/common";
import { Box } from "@/ui/box";
import { ModalKeyboardFrame } from "@/components/modals/modal-keyboard-frame";
import { PaywallLink } from "./paywall-link";
import { Input, InputField } from "@/ui/input";
import { Heading } from "@/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/modal";

type AndroidPromoCodeProps = {
  isDisabled: boolean;
  isSubscriber: boolean;
  code: string;
  isModalOpen: boolean;
  isRedeeming: boolean;
  onChangeCode: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  onRedeem: () => void;
};

export const AndroidPromoCode = memo(
  ({
    isDisabled,
    isSubscriber,
    code,
    isModalOpen,
    isRedeeming,
    onChangeCode,
    onOpen,
    onClose,
    onRedeem,
  }: AndroidPromoCodeProps) => {
    const { t } = useTranslation();

    if (isSubscriber) {
      return null;
    }

    return (
      <>
        <Box className="mt-3 items-center">
          <PaywallLink
            label={t("paywall.promoCta")}
            onPress={onOpen}
            disabled={isDisabled}
            emphasized
          />
        </Box>
        <Modal isOpen={isModalOpen} onClose={onClose} size="md">
          <ModalBackdrop />
          <ModalKeyboardFrame>
            <ModalContent className="shrink">
              <ModalHeader className="justify-center">
                <Heading size="md">{t("paywall.promoCta")}</Heading>
              </ModalHeader>
              <ModalBody keyboardShouldPersistTaps="handled">
                <Input>
                  <InputField
                    testID="paywall-promo-input"
                    value={code}
                    onChangeText={onChangeCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    placeholder={t("paywall.promoPlaceholder")}
                  />
                </Input>
              </ModalBody>
              <ModalFooter>
                <AppButton
                  testID="paywall-promo-redeem"
                  label={
                    isRedeeming
                      ? t("paywall.processing")
                      : t("paywall.promoRedeem")
                  }
                  onPress={onRedeem}
                  isDisabled={isRedeeming || !code.trim()}
                  className="w-full"
                />
              </ModalFooter>
            </ModalContent>
          </ModalKeyboardFrame>
        </Modal>
      </>
    );
  },
);

AndroidPromoCode.displayName = "AndroidPromoCode";
