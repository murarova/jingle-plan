import { useState } from "react";
import { Alert } from "react-native";
import { ImageData } from "../types/types";
import { useSaveImageMutation, useLazyGetImageUrlQuery } from "../services/api";
import { useAppSelector } from "../store/withTypes";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "../utils/utils";

export function useImage() {
  const { t } = useTranslation();
  const [image, setImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedYear } = useAppSelector((state) => state.app);
  const [saveImage, { isLoading: isSaving }] = useSaveImageMutation();
  const [getImageUrl, { isLoading: isUrlLoading }] = useLazyGetImageUrlQuery();

  async function saveUserImage() {
    if (!image) return;
    try {
      await saveImage({ image, year: selectedYear }).unwrap();
      const result = await getImageUrl({
        id: image.id,
        year: selectedYear,
      }).unwrap();
      return result;
    } catch (error) {
      const message =
        resolveErrorMessage(error) ??
        t("errors.generic", "An error occurred");

      Alert.alert(t("common.error"), message);
    }
  }

  return {
    saveImage: saveUserImage,
    image,
    setImage,
    isLoading: isSaving || isUrlLoading || isLoading,
    setIsLoading,
  };
}
