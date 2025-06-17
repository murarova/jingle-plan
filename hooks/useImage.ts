import { useState } from "react";
import { Alert } from "react-native";
import { ImageData } from "../types/types";
import { getImageUrlAsync, saveImageAsync } from "../services/data-api";
import { useAppDispatch } from "../store/withTypes";

export function useImage() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const dispatch = useAppDispatch();

  async function saveUserImage() {
    if (!image) return;
    try {
      setIsImageLoading(true);
      await dispatch(saveImageAsync({ image })).unwrap();
      return await dispatch(getImageUrlAsync({ id: image.id })).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Image was not saved");
    } finally {
      setIsImageLoading(false);
    }
  }

  return {
    saveImage: saveUserImage,
    image,
    setImage,
    setIsLoading: setIsImageLoading,
    isLoading: isImageLoading,
  };
}
