import { ImageBackground } from "@/ui/image-background";
import { ButtonText, Button } from "@/ui/button";
import { Box } from "@/ui/box";
import * as ExpoImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import uuid from "react-native-uuid";
import { Loader } from "./loader";
import { ImageData } from "@/types";

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
      quality: 0.8,
      exif: false,
    });

    if (result.canceled) {
      setIsImageLoading(false);
      return;
    }

    const asset = result.assets[0];
    setImage({
      id: image?.id ?? uuid.v4().toString(),
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });
  };

  const showPreview = Boolean(image) || isImageLoading;

  return (
    <Box>
      {showPreview && (
        <Box className="relative h-[300px] w-full overflow-hidden rounded-lg bg-backgroundLight-50">
          {image && (
            <ImageBackground
              style={{ flex: 1, justifyContent: "center" }}
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
          className="mt-2"
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
