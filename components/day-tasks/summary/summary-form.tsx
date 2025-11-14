import { memo } from "react";
import { Button, ButtonText, VStack, HStack } from "@gluestack-ui/themed";
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
      <VStack space="md" width="100%">
        <HappySlider rate={rate} setRate={onRateChange} isDisabled={false} />
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          minHeight={120}
        />
        <HStack space="sm" mt="$2">
          <Button
            flex={1}
            variant="outline"
            onPress={onCancel}
            borderRadius="$lg"
          >
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button flex={1} onPress={onSubmit} borderRadius="$lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

SummaryForm.displayName = "SummaryForm";
