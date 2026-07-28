import { Divider } from "@/ui/divider";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { useTranslation } from "react-i18next";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { months } from "@/constants";
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
  sheetRef: React.RefObject<SheetRef | null>;
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
      setTimeout(() => {
        setSelectedMonth("");
      }, 100);
    }
  };

  const handleGoBack = () => {
    sheetRef.current?.hide();
    if (selectedMonth) {
      setSelectedMonth("");
    }
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <VStack space="md" className="px-9">
          <Button
            size="lg"
            onPress={handleDone}
            disabled={!selectedMonth}
            className="bg-red-600"
          >
            <ButtonText className="text-white text-md font-semibold">
              {t("common.submitBtnText")}
            </ButtonText>
          </Button>
        </VStack>
      </BottomSheetFooter>
    ),
    [selectedMonth, handleDone, t],
  );

  const snapPoints = useMemo(() => ["70%", "90%"], []);

  return (
    <Sheet
      ref={sheetRef}
      snapPoints={snapPoints}
      footerComponent={renderFooter}
    >
      <Box className="flex justify-start items-start">
        <Button variant="link" onPress={handleGoBack}>
          <ChevronLeft size={24} color="#007AFF" />
          <Text className="text-[#007AFF] text-md ml-1">
            {t("common.back")}
          </Text>
        </Button>
      </Box>
      <Text className="text-lg font-[700] text-center mb-6">
        {t("monthSelect.title")}
      </Text>
      <BottomSheetScrollView>
        <VStack className="mb-2 px-4">
          <Box className="pb-[100px]">
            {months.map((month) => (
              <Box key={month.value} className="mb-1">
                <RadioButton
                  value={month.value}
                  label={month.long}
                  selected={selectedMonth === month.value}
                  onSelect={handleMonthSelect}
                  size="medium"
                />
                <Divider className="mt-1" />
              </Box>
            ))}

            <Box className="mb-1">
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
