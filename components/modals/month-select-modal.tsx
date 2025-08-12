import {
  Box,
  Text,
  Button,
  ButtonText,
  VStack,
  Divider,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { months } from "../../constants/constants";
import { ChevronLeft } from "lucide-react-native";
import { Sheet, SheetRef, RadioButton } from "../common";
import { BottomSheetScrollView, BottomSheetFooter } from "@gorhom/bottom-sheet";

export function MonthSelectModal({
  onMonthSelect,
  sheetRef,
  month,
}: {
  onMonthSelect: (month: string) => void;
  closeMonthModal: () => void;
  sheetRef: React.RefObject<SheetRef>;
  month?: string;
}) {
  useEffect(() => {
    if (month) {
      setSelectedMonth(month);
    }
  }, [month]);

  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const handleDone = () => {
    if (selectedMonth) {
      onMonthSelect(selectedMonth);
      setSelectedMonth("");
    }
  };

  const handleGoBack = () => {
    if (selectedMonth) {
      setSelectedMonth("");
    }
    sheetRef.current?.hide();
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <VStack space="md" px="$9">
          <Button
            size="lg"
            backgroundColor="$red600"
            onPress={handleDone}
            disabled={!selectedMonth}
          >
            <ButtonText color="$white" fontSize="$md" fontWeight="$semibold">
              {t("common.submitBtnText")}
            </ButtonText>
          </Button>
        </VStack>
      </BottomSheetFooter>
    ),
    [selectedMonth, handleDone, t]
  );

  const snapPoints = useMemo(() => ["70%", "90%"], []);

  return (
    <Sheet
      ref={sheetRef}
      snapPoints={snapPoints}
      footerComponent={renderFooter}
    >
      <Box display="flex" justifyContent="flex-start" alignItems="flex-start">
        <Button variant="link" onPress={handleGoBack}>
          <ChevronLeft size={24} color="#007AFF" />
          <Text color="#007AFF" fontSize="$md" ml="$1">
            {t("common.back")}
          </Text>
        </Button>
      </Box>
      <Text fontSize="$lg" fontWeight="700" textAlign="center" mb="$6">
        {t("monthSelect.title")}
      </Text>

      <BottomSheetScrollView>
        <VStack mb="$2" px="$4">
          <Box pb={100}>
            {months.map((month) => (
              <Box key={month.value} mb="$1">
                <RadioButton
                  value={month.value}
                  label={month.long}
                  selected={selectedMonth === month.value}
                  onSelect={handleMonthSelect}
                  size="medium"
                />
                <Divider mt="$1" />
              </Box>
            ))}

            <Box mb="$1">
              <RadioButton
                value="every"
                label={t("monthSelect.everyMonth")}
                selected={selectedMonth === "every"}
                onSelect={handleMonthSelect}
                size="medium"
              />
            </Box>
          </Box>
        </VStack>
      </BottomSheetScrollView>
    </Sheet>
  );
}
