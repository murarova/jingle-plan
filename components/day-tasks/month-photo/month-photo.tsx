import { Box } from "@gluestack-ui/themed";
import { memo } from "react";
import { MonthPhotoData } from "../../../types/types";
import { MonthPhotoForm } from "./month-photo-form";
import { MonthPhotoView } from "./month-photo-view";
import { useMonthPhoto } from "./hooks/useMonthPhoto";

interface MonthPhotoProps {
  context: string;
  data: MonthPhotoData | null;
}

export const MonthPhoto = memo(({ context, data }: MonthPhotoProps) => {
  const {
    isEditing,
    text,
    image,
    isLoading,
    isSaving,
    isRemoving,
    setIsLoading,
    setImage,
    handleTaskRemove,
    handleTaskSubmit,
    handleEdit,
    handleCancel,
    handleTextChange,
  } = useMonthPhoto({ context, data });

  return (
    <Box>
      {isEditing ? (
        <MonthPhotoForm
          text={text}
          image={image}
          isImageLoading={isLoading}
          onTextChange={handleTextChange}
          onImageChange={setImage}
          onSubmit={handleTaskSubmit}
          onCancel={handleCancel}
          setImageLoading={setIsLoading}
        />
      ) : (
        <MonthPhotoView
          image={image}
          text={data?.[context]?.text}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleTaskRemove}
        />
      )}
    </Box>
  );
});

MonthPhoto.displayName = "MonthPhoto";
