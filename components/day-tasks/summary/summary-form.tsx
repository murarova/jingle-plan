import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { HappySlider } from "./happy-slider";
import {
  AppButton,
  AutoGrowingTextarea,
  KeyboardAwareGroup,
} from "../../common";

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
        <KeyboardAwareGroup>
          <AutoGrowingTextarea
            value={text}
            onChangeText={onTextChange}
            placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          />
          <HStack className="mt-2 w-full gap-3">
            <AppButton
              variant="secondary"
              label={t("common.cancel")}
              onPress={onCancel}
              className="min-w-0 flex-1 basis-0"
            />
            <AppButton
              label={t("screens.tasksOfTheDay.submitBtnText")}
              onPress={onSubmit}
              className="min-w-0 flex-1 basis-0"
            />
          </HStack>
        </KeyboardAwareGroup>
      </VStack>
    );
  }
);

SummaryForm.displayName = "SummaryForm";
