import { ImageBackground } from "@/ui/image-background";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { ActionButtons, AnimatedView, Loader } from "../../common";
import { ImageData } from "../../../types/types";

interface MonthPhotoViewProps {
  image: ImageData | null;
  text: string | undefined;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  setIsImageLoading: (isLoading: boolean) => void;
}

export const MonthPhotoView = memo(
  ({
    image,
    text,
    isLoading,
    onEdit,
    onDelete,
    setIsImageLoading,
  }: MonthPhotoViewProps) => {
    return (
      <Box>
        {image && (
          <Box className="flex-1">
            {isLoading && (
              <Box
                className="absolute bg-blueGray-100 opacity-60 top-0 bottom-0 left-0 right-0 z-2">
                <Loader size="large" />
              </Box>
            )}
            <AnimatedView style={{ zIndex: 1 }} show={!isLoading}>
              <Box className="h-[300px] w-full">
                <ImageBackground
                  style={{ flex: 1, justifyContent: "center" }}
                  source={{ uri: image?.uri }}
                  resizeMode="contain"
                  onLoadStart={() => setIsImageLoading(true)}
                  onLoadEnd={() => setIsImageLoading(false)}
                />
              </Box>
            </AnimatedView>
          </Box>
        )}
        {text && (
          <Box className="mt-3">
            <Text>{text}</Text>
          </Box>
        )}
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </Box>
    );
  }
);

MonthPhotoView.displayName = "MonthPhotoView";
