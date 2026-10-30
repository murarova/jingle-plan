import { HStack } from "@/ui/hstack";
import { VStack } from "@/ui/vstack";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { AppButton, AutoGrowingTextarea, ImagePicker } from "../../common";
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
      <VStack className="w-full">
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
        <HStack className="mt-2 gap-3">
          {text || image ? (
            <AppButton
              variant="secondary"
              label={t("common.cancel")}
              onPress={onCancel}
              className="flex-1"
            />
          ) : null}
          <AppButton
            label={t("screens.tasksOfTheDay.submitBtnText")}
            onPress={onSubmit}
            className="flex-1"
          />
        </HStack>
      </VStack>
    );
  },
);

MonthPhotoForm.displayName = "MonthPhotoForm";
