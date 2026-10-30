import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AppButton, AutoGrowingTextarea } from "../../common";

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
      <VStack space="md" className="w-full">
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={placeholderText}
          onSubmitEditing={handleSubmit}
        />
        <HStack className="mt-2 gap-3">
          <AppButton
            variant="secondary"
            label={t("common.cancel")}
            onPress={onCancel}
            className="flex-1"
          />
          <AppButton
            label={submitButtonText}
            onPress={handleSubmit}
            accessibilityLabel="Save goals"
            className="flex-1"
          />
        </HStack>
      </VStack>
    );
  },
);

GoalsForm.displayName = "GoalsForm";
