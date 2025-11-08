import { memo, useMemo } from "react";
import { Box } from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { TaskContext, TextData } from "../../../types/types";
import { useGoals } from "./hooks/useGoals";
import { GoalsForm } from "./goals-form";
import { GoalsView } from "./goals-view";

interface GoalsProps {
  context: TaskContext;
  data: {
    [key in TaskContext]?: TextData | null;
  };
}

export const Goals = memo(({ context, data }: GoalsProps) => {
  const { t } = useTranslation();
  const {
    isEditing,
    text,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleCancel,
  } = useGoals({ context, data });

  const placeholderText = useMemo(
    () => t("screens.tasksOfTheDay.textareaPlaceholder"),
    [t]
  );

  const submitButtonText = useMemo(
    () => t("screens.tasksOfTheDay.submitBtnText"),
    [t]
  );

  const emptyText = useMemo(() => t("common.empty"), [t]);

  return (
    <Box width="100%">
      {isEditing ? (
        <GoalsForm
          initialText={text}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          placeholderText={placeholderText}
          submitButtonText={submitButtonText}
        />
      ) : (
        <GoalsView
          text={text}
          emptyText={emptyText}
          onEdit={handleEdit}
          onDelete={handleRemove}
        />
      )}
    </Box>
  );
});

Goals.displayName = "Goals";
