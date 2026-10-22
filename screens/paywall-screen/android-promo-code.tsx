import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "@/ui/button";
import { Input, InputField } from "@/ui/input";
import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
import { KeyboardAvoidingView } from "@/ui/keyboard-avoiding-view";
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
  promoErrorMessage: string | null;
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
    promoErrorMessage,
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
        <Button
          variant="outline"
          isDisabled={isDisabled}
          onPress={onOpen}
          className="mt-3 rounded-xl border-primary-600"
        >
          <ButtonText className="text-primary-600">
            {t("paywall.promoCta")}
          </ButtonText>
        </Button>
        <Modal isOpen={isModalOpen} onClose={onClose} size="md">
          <ModalBackdrop />
          <KeyboardAvoidingView
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            behavior="padding"
          >
            <ModalContent>
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
                {promoErrorMessage ? (
                  <Text className="text-sm text-red-500 text-center mt-3">
                    {promoErrorMessage}
                  </Text>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button
                  testID="paywall-promo-redeem"
                  isDisabled={isRedeeming || !code.trim()}
                  onPress={onRedeem}
                  className="rounded-lg w-full bg-primary-600 border-primary-600"
                >
                  <ButtonText>
                    {isRedeeming
                      ? t("paywall.processing")
                      : t("paywall.promoRedeem")}
                  </ButtonText>
                </Button>
              </ModalFooter>
            </ModalContent>
          </KeyboardAvoidingView>
        </Modal>
      </>
    );
  },
);

AndroidPromoCode.displayName = "AndroidPromoCode";
