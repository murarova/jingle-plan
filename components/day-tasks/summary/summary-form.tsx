import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { HappySlider } from "./happy-slider";
import { AutoGrowingTextarea } from "../../common";

interface SummaryFormProps {
  text: string;
  rate: number;
  onTextChange: (text: string) => void;
  onRateChange: (rate: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const SummaryForm = memo(
  ({
    text,
    rate,
    onTextChange,
    onRateChange,
    onSubmit,
    onCancel,
  }: SummaryFormProps) => {
    const { t } = useTranslation();

    return (
      <VStack space="md" className="w-full">
        <HappySlider rate={rate} setRate={onRateChange} isDisabled={false} />
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          minHeight={120}
        />
        <HStack space="sm" className="mt-2">
          <Button variant="outline" onPress={onCancel} className="flex-1 rounded-lg">
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button onPress={onSubmit} className="flex-1 rounded-lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

SummaryForm.displayName = "SummaryForm";
