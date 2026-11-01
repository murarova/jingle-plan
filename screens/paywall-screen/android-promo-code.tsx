import { memo, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components/common";
import { useModalKeyboardShift } from "@/hooks/useModalKeyboardShift";
import { Input, InputField } from "@/ui/input";
import { Heading } from "@/ui/heading";
import { Text } from "@/ui/text";
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
    const modalRef = useRef<View>(null);
    const translateY = useModalKeyboardShift(modalRef);

    if (isSubscriber) {
      return null;
    }

    return (
      <>
        <AppButton
          variant="secondary"
          label={t("paywall.promoCta")}
          onPress={onOpen}
          isDisabled={isDisabled}
          className="mt-3"
        />
        <Modal isOpen={isModalOpen} onClose={onClose} size="md">
          <ModalBackdrop />
          <View
            ref={modalRef}
            pointerEvents="box-none"
            style={{
              width: "100%",
              alignItems: "center",
              transform: [{ translateY }],
            }}
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
          </View>
        </Modal>
      </>
    );
  },
);

AndroidPromoCode.displayName = "AndroidPromoCode";
