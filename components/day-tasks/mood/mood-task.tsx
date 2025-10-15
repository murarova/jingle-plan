import { Box } from "@gluestack-ui/themed";
import { memo } from "react";
import { TaskOutputType } from "../../../constants/constants";
import { MoodTaskData } from "../../../types/types";
import { MoodForm } from "./mood-form";
import { MoodView } from "./mood-view";
import { useMoodTask } from "./hooks/useMoodTask";
import { useTranslation } from "react-i18next";

interface MoodProps {
  data: MoodTaskData | null;
  day: string;
  taskOutputType: TaskOutputType;
}

export const MoodTask = memo(({ data, day, taskOutputType }: MoodProps) => {
  const {
    isEditing,
    text,
    image,
    isLoading,
    setIsLoading,
    setImage,
    handleTaskRemove,
    handleTextChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    isEditable,
  } = useMoodTask({ data, day, taskOutputType });

  const { t } = useTranslation();

  return (
    <Box>
      {isEditing ? (
        <MoodForm
          text={text}
          taskOutputType={taskOutputType}
          onTextChange={handleTextChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          image={image}
          isImageLoading={isLoading}
          setImageLoading={setIsLoading}
          setImage={setImage}
          isEditable={isEditable}
        />
      ) : (
        <MoodView
          text={text}
          image={image}
          isImageLoading={isLoading}
          isEditable={isEditable}
          onEdit={handleEdit}
          onDelete={handleTaskRemove}
        />
      )}
    </Box>
  );
});

MoodTask.displayName = "MoodTask";
