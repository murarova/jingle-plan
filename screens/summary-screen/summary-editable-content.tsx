import { HStack } from "@/ui/hstack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "@/types";
import {
  AppButton,
  AutoGrowingTextarea,
  KeyboardAwareGroup,
} from "../../components/common";

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
    );
  }
);

EditableContent.displayName = "EditableContent";
