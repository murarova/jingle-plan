import { Image } from "@/ui/image";
import { ButtonText, Button } from "@/ui/button";
import { Box } from "@/ui/box";
import * as ExpoImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import uuid from "react-native-uuid";
import { Loader } from "./loader";
import { ImageData } from "@/types";
import { resizeImageForUpload } from "@/utils/resize-image";

interface ImagePickerProps {
  image: ImageData | null;
  setImage: (image: ImageData) => void;
  edit: boolean;
  setIsImageLoading: (isLoading: boolean) => void;
  isImageLoading: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  image,
  setImage,
  edit,
  setIsImageLoading,
  isImageLoading,
}) => {
  const { t } = useTranslation();

  const pickImage = async () => {
    setIsImageLoading(true);

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: false,
    });

    if (result.canceled) {
      setIsImageLoading(false);
      return;
    }

    const asset = result.assets[0];
    const resized = await resizeImageForUpload({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });

    setImage({
      id: image?.id ?? uuid.v4().toString(),
      uri: resized.uri,
      width: resized.width,
      height: resized.height,
    });
  };

  const showPreview = Boolean(image) || isImageLoading;

  return (
    <Box>
      {showPreview && (
        <Box className="relative h-[300px] w-full overflow-hidden rounded-lg bg-ivory-badge">
          {image && (
            <Image
              size="full"
              source={{ uri: image.uri }}
              onLoadEnd={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
              resizeMode="contain"
            />
          )}
          {isImageLoading && <Loader size="large" absolute />}
        </Box>
      )}
      {edit && (
        <Button
          className="mt-4"
          variant="link"
          onPress={pickImage}
          isDisabled={isImageLoading}
        >
          <ButtonText>
            {image ? t("common.pickAnother") : t("common.pickPhoto")}
          </ButtonText>
        </Button>
      )}
    </Box>
  );
};
