import { memo } from "react";
import {
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../types/types";

interface EditableContentProps {
  context: TaskContext;
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const EditableContent = memo(
  ({ text, onTextChange, onSubmit, onCancel }: EditableContentProps) => {
    const { t } = useTranslation();

    return (
      <>
        <Textarea width="100%">
          <TextareaInput
            onChangeText={onTextChange}
            value={text}
            placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
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
      </>
    );
  }
);

EditableContent.displayName = "EditableContent";
