import { Text } from "@/ui/text";
import { Heading } from "@/ui/heading";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalFooter, ModalBody } from "@/ui/modal";
import { Center } from "@/ui/center";
import { Button, ButtonText } from "@/ui/button";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import DeerSvg from "../../assets/svg/deer";

export function CompletedTaskModal({
  setShowModal,
}: {
  setShowModal: (value: boolean) => void,
}) {
  const { t } = useTranslation();
  const ref = useRef(null);
  return (
    <Center>
      <Modal
        isOpen={true}
        onClose={() => {
          setShowModal(false);
        }}
        finalFocusRef={ref}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="justify-center">
            <Heading size="md">{t("screens.completedTaskModal.title")}</Heading>
          </ModalHeader>
          <ModalBody>
            <Center>
              <Text size="sm">{t("screens.completedTaskModal.text")}</Text>
            </Center>
            <Center className="mt-10 mb-5">
              <DeerSvg />
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
              className="rounded-lg w-full">
              <ButtonText>{t("screens.completedTaskModal.btn")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
