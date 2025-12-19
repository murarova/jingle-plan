import { memo, useCallback } from "react";
import { Button, ButtonText, VStack, HStack } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { AutoGrowingTextarea } from "../../common";

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
      <VStack space="md" width="100%">
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={placeholderText}
          onSubmitEditing={handleSubmit}
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
          <Button
            flex={1}
            onPress={handleSubmit}
            borderRadius="$lg"
            accessibilityLabel="Save goals"
          >
            <ButtonText>{submitButtonText}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

GoalsForm.displayName = "GoalsForm";
