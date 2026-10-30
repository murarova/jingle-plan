import { HStack } from "@/ui/hstack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "@/types";
import { AppButton, AutoGrowingTextarea } from "../../components/common";

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
        <HStack className="mt-2 gap-3">
          <AppButton
            variant="secondary"
            label={t("common.cancel")}
            onPress={onCancel}
            className="flex-1"
          />
          <AppButton
            label={t("screens.tasksOfTheDay.submitBtnText")}
            onPress={onSubmit}
            className="flex-1"
          />
        </HStack>
      </>
    );
  }
);

EditableContent.displayName = "EditableContent";
