import {
  Box,
  Button,
  ButtonText,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { TaskOutputType } from "../../../constants/constants";
import { ImagePicker } from "../../common";

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
      <VStack space="md" width="100%">
        {showText && (
          <Textarea width="100%" mb="$4">
            <TextareaInput
              onChangeText={onTextChange}
              value={text}
              placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
            />
          </Textarea>
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
          <Button onPress={onSubmit} mt="$2" borderRadius="$lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        )}
      </VStack>
    );
  }
);

MoodForm.displayName = "MoodForm";
