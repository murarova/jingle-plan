import { HStack } from "@/ui/hstack";
import { Button, ButtonText } from "@/ui/button";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "@/types";
import { AutoGrowingTextarea } from "../../components/common";

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
        <AutoGrowingTextarea
          value={text}
          onChangeText={onTextChange}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
        />
        <HStack space="sm" className="mt-2">
          <Button
            variant="outline"
            onPress={onCancel}
            className="flex-1 rounded-lg"
          >
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button onPress={onSubmit} className="flex-1 rounded-lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </HStack>
      </>
    );
  }
);

EditableContent.displayName = "EditableContent";
