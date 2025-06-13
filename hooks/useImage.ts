import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ImageData } from "../types/types";
import { getImageUrlAsync, saveImageAsync } from "../services/data-api";
import { useAppDispatch, useAppSelector } from "../store/withTypes";

export function useImage() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { imageUrl } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (image && imageUrl) {
      setImage({
        ...image,
        uri: imageUrl,
      } as ImageData);
    }
  }, [imageUrl]);

  async function saveUserImage() {
    if (!image) return;
    try {
      setIsImageLoading(true);
      await dispatch(saveImageAsync({ image })).unwrap();
      await dispatch(getImageUrlAsync({ id: image.id })).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Image was not saved");
    } finally {
      setIsImageLoading(false);
    }
  }

  function removeImage() {}

  return {
    saveImage: saveUserImage,
    removeImage,
    image,
    setImage,
    setIsLoading: setIsImageLoading,
    isLoading: isImageLoading,
  };
}
