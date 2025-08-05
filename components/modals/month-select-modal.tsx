import {
  Box,
  Text,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import { months } from "../../constants/constants";

export function MonthSelectModal({
  onMonthSelect,
  closeMonthModal,
}: {
  onMonthSelect: (month: string) => void;
  closeMonthModal: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal isOpen onClose={closeMonthModal}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader
          backgroundColor="$primary500"
          justifyContent="center"
          pb="$4"
        >
          <Text color="$white" fontWeight="600">
            {t("monthSelect.title")}
          </Text>
        </ModalHeader>
        <Box p="$4">
          <FlatList
            data={months}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Button
                width={85}
                variant="link"
                marginBottom="$3"
                onPress={() => onMonthSelect(item.value)}
              >
                <ButtonText fontWeight="400" color="$black">
                  {item.short}
                </ButtonText>
              </Button>
            )}
          />
          <Button
            variant="link"
            marginBottom="$3"
            onPress={() => onMonthSelect("every")}
          >
            <ButtonText fontWeight="400" color="$black">
              {t("monthSelect.everyMonth")}
            </ButtonText>
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
