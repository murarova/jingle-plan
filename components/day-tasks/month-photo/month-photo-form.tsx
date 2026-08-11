import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { Button, ButtonText } from "@/ui/button";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { AutoGrowingTextarea, ImagePicker } from "../../common";
import { ImageData } from "@/types";

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
      <VStack space="md" className="w-full">
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
          containerStyle={{ marginTop: 16 }}
        />
        <HStack space="sm" className="mt-2">
          {text || image ? (
            <Button
              variant="outline"
              onPress={onCancel}
              className="flex-1 rounded-lg"
            >
              <ButtonText>{t("common.cancel")}</ButtonText>
            </Button>
          ) : null}
          <Button onPress={onSubmit} className="flex-1 rounded-lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

MonthPhotoForm.displayName = "MonthPhotoForm";
