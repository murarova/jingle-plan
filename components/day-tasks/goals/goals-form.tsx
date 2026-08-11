import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { memo, useCallback } from "react";
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

    const renderFooter = useCallback(
      ({ close }: { close: () => void }) => (
        <HStack space="sm" className="w-full">
          <Button
            variant="outline"
            onPress={() => {
              onCancel();
              close();
            }}
            className="flex-1 rounded-lg"
          >
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button
            onPress={() => {
              handleSubmit();
              close();
            }}
            accessibilityLabel="Save goals"
            className="flex-1 rounded-lg"
          >
            <ButtonText>{submitButtonText}</ButtonText>
          </Button>
        </HStack>
      ),
      [handleSubmit, onCancel, submitButtonText, t],
    );

    return (
      <VStack space="md" className="w-full">
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={placeholderText}
          onSubmitEditing={handleSubmit}
          renderFooter={renderFooter}
        />
        <HStack space="sm" className="mt-2">
          <Button variant="outline" onPress={onCancel} className="flex-1 rounded-lg">
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button
            onPress={handleSubmit}
            accessibilityLabel="Save goals"
            className="flex-1 rounded-lg">
            <ButtonText>{submitButtonText}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

GoalsForm.displayName = "GoalsForm";
