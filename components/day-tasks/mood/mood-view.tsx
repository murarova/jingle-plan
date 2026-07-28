import { ImageBackground } from "@/components/ui/image-background";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { memo } from "react";
import { ActionButtons, AnimatedView, Loader } from "../../common";

interface MoodViewProps {
  text?: string;
  image: any;
  isImageLoading: boolean;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const MoodView = memo(
  ({
    text,
    image,
    isImageLoading,
    isEditable,
    onEdit,
    onDelete,
  }: MoodViewProps) => (
    <Box>
      {text && (
        <>
          <Divider className="mb-4" />
          <Box className="mb-2">
            <Text>{text}</Text>
          </Box>
        </>
      )}

      {image && (
        <Box className="flex-1">
          {isImageLoading && (
            <Box
              className="absolute bg-blueGray-100 opacity-60 top-0 bottom-0 left-0 right-0 z-2">
              <Loader size="large" />
            </Box>
          )}
          <AnimatedView style={{ zIndex: 1 }} show={!isImageLoading}>
              <Box className="h-[300px] w-full">
              <ImageBackground
                style={{ flex: 1, justifyContent: "center" }}
                src={image?.uri}
                resizeMode="contain"
              />
            </Box>
          </AnimatedView>
        </Box>
      )}

      {isEditable && <ActionButtons onEdit={onEdit} onDelete={onDelete} />}
    </Box>
  )
);

MoodView.displayName = "MoodView";
