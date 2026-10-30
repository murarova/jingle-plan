import { Text } from "@/ui/text";
import { Heading } from "@/ui/heading";
import { Modal, ModalBackdrop, ModalContent } from "@/ui/modal";
import { Box } from "@/ui/box";
import { Center } from "@/ui/center";
import { AppButton } from "@/components/common";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FestiveReindeer } from "./festive-reindeer";

export function CompletedTaskModal({
  setShowModal,
}: {
  setShowModal: (value: boolean) => void;
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
        <ModalContent
          className="w-[361px] max-w-[92%] overflow-visible rounded-3xl border border-ivory-line bg-ivory-card"
          style={{
            shadowColor: "#2B211A",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12,
            shadowRadius: 36,
            elevation: 8,
          }}
        >
          <Box className="w-full gap-5 px-4 pb-5 pt-6">
            <Box className="w-full items-center gap-3">
              <Box className="h-1 w-8 rounded-full bg-[#7EB344]" />
              <Heading
                size="xl"
                className="text-center text-primaryText"
                style={{ fontWeight: "700" }}
              >
                {t("screens.completedTaskModal.title")}
              </Heading>
              <Text
                className="text-center text-primaryText"
                style={{ fontSize: 17, lineHeight: 24 }}
              >
                {t("screens.completedTaskModal.text")}
              </Text>
            </Box>
            <Box className="items-center">
              <FestiveReindeer />
            </Box>
            <AppButton
              label={t("screens.completedTaskModal.btn")}
              onPress={() => {
                setShowModal(false);
              }}
              className="w-full self-stretch"
            />
          </Box>
        </ModalContent>
      </Modal>
    </Center>
  );
}
