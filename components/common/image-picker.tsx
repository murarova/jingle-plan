import { ImageBackground } from "@/ui/image-background";
import { ButtonText, Button } from "@/ui/button";
import { Box } from "@/ui/box";
import * as ExpoImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import uuid from "react-native-uuid";
import { Loader } from "./loader";
import { AnimatedView } from "./animated-view";
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
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setIsImageLoading(true);
      const id = image?.id ?? uuid.v4().toString();

      const newImage: ImageData = {
        id,
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
      };
      setImage(newImage);
    }
  };

  return (
    <Box>
      {(image || isImageLoading) && (
        <Box className="flex-1">
          {isImageLoading && (
            <Box
              className="absolute bg-blueGray-100 opacity-60 top-0 bottom-0 left-0 right-0 z-2">
              <Loader size="large" />
            </Box>
          )}
          {image && (
            <AnimatedView style={{ zIndex: 2 }} show={!isImageLoading}>
              <Box className="h-[300px] w-full">
                <ImageBackground
                  style={{ flex: 1, justifyContent: "center" }}
                  source={{ uri: image.uri }}
                  onLoadStart={() => setIsImageLoading(true)}
                  onLoadEnd={() => setIsImageLoading(false)}
                  resizeMode="contain"
                />
              </Box>
            </AnimatedView>
          )}
          {!image && isImageLoading && (
            <Box className="h-[300px] w-full" />
          )}
        </Box>
      )}
      {edit && (
        <Button variant="link" onPress={pickImage}>
          <ButtonText>
            {image ? t("common.pickAnother") : t("common.pickPhoto")}
          </ButtonText>
        </Button>
      )}
    </Box>
  );
};
