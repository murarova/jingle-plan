import {
  Box,
  Button,
  ButtonText,
  Text,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { AutoGrowingTextarea, ImagePicker } from "../../common";
import { ImageData } from "../../../types/types";

interface MonthPhotoFormProps {
  text: string;
  image: ImageData | null;
  isImageLoading: boolean;
  onTextChange: (text: string) => void;
  onImageChange: (image: ImageData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  setImageLoading: (loading: boolean) => void;
}

export const MonthPhotoForm = memo(
  ({
    text,
    image,
    isImageLoading,
    onTextChange,
    onImageChange,
    onSubmit,
    onCancel,
    setImageLoading,
  }: MonthPhotoFormProps) => {
    const { t } = useTranslation();

    return (
      <VStack space="md" width="100%">
        <ImagePicker
          setIsImageLoading={setImageLoading}
          isImageLoading={isImageLoading}
          edit={true}
          setImage={onImageChange}
          image={image}
        />
        <AutoGrowingTextarea
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          value={text}
          onChangeText={onTextChange}
          style={{ marginTop: 16 }}
        />
        <HStack space="sm" mt="$2">
          {text || image ? (
            <Button
              flex={1}
              variant="outline"
              onPress={onCancel}
              borderRadius="$lg"
            >
              <ButtonText>{t("common.cancel")}</ButtonText>
            </Button>
          ) : null}
          <Button flex={1} onPress={onSubmit} borderRadius="$lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

MonthPhotoForm.displayName = "MonthPhotoForm";
