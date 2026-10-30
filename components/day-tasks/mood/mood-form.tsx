import { VStack } from "@/ui/vstack";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { TaskOutputType } from "@/constants";
import { AppButton, AutoGrowingTextarea, ImagePicker } from "../../common";

interface MoodFormProps {
  text: string;
  taskOutputType: TaskOutputType;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  image: any;
  isImageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  setImage: (image: any) => void;
  isEditable: boolean;
}

export const MoodForm = memo(
  ({
    text,
    taskOutputType,
    onTextChange,
    onSubmit,
    image,
    isImageLoading,
    setImageLoading,
    setImage,
    isEditable,
  }: MoodFormProps) => {
    const { t } = useTranslation();

    const showText =
      taskOutputType === TaskOutputType.Text ||
      taskOutputType === TaskOutputType.TextPhoto;
    const showImage =
      taskOutputType === TaskOutputType.Image ||
      taskOutputType === TaskOutputType.TextPhoto;

    return (
      <VStack space="md" className="w-full">
        {showText && (
          <AutoGrowingTextarea
            value={text}
            onChangeText={onTextChange}
            placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
            containerStyle={{ marginBottom: 16 }}
          />
        )}
        {showImage && (
          <ImagePicker
            setIsImageLoading={setImageLoading}
            isImageLoading={isImageLoading}
            edit={true}
            setImage={setImage}
            image={image}
          />
        )}
        {isEditable && (
          <AppButton
            label={t("screens.tasksOfTheDay.submitBtnText")}
            onPress={onSubmit}
            className="mt-2"
          />
        )}
      </VStack>
    );
  }
);

MoodForm.displayName = "MoodForm";
