import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AutoGrowingTextarea,
  KeyboardAwareGroup,
} from "../../common";

interface GoalsFormProps {
  text: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  onTextChange: (text: string) => void;
  placeholderText: string;
  submitButtonText: string;
}

export const GoalsForm = memo(
  ({
    text,
    onSubmit,
    onCancel,
    onTextChange,
    placeholderText,
    submitButtonText,
  }: GoalsFormProps) => {
    const { t } = useTranslation();

    const handleSubmit = useCallback(() => {
      onSubmit(text);
    }, [text, onSubmit]);

    return (
      <KeyboardAwareGroup>
        <VStack space="md" className="w-full">
          <AutoGrowingTextarea
            value={text}
            onChangeText={onTextChange}
            placeholder={placeholderText}
            onSubmitEditing={handleSubmit}
          />
          <HStack className="mt-2 w-full gap-3">
            <AppButton
              variant="secondary"
              label={t("common.cancel")}
              onPress={onCancel}
              className="min-w-0 flex-1 basis-0"
            />
            <AppButton
              label={submitButtonText}
              onPress={handleSubmit}
              accessibilityLabel="Save goals"
              className="min-w-0 flex-1 basis-0"
            />
          </HStack>
        </VStack>
      </KeyboardAwareGroup>
    );
  },
);

GoalsForm.displayName = "GoalsForm";
