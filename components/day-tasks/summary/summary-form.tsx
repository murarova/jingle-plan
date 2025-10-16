import { memo } from "react";
import {
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { HappySlider } from "./happy-slider";

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
        <Textarea width="100%">
          <TextareaInput
            onChangeText={onTextChange}
            value={text}
            placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            onSubmitEditing={onSubmit}
          />
        </Textarea>
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
