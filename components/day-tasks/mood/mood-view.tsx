import { Box, Button, Divider, Text } from "@gluestack-ui/themed";
import { memo } from "react";
import { ActionButtons, AnimatedView, Loader } from "../../common";
import { ImageBackground } from "@gluestack-ui/themed";
import { ButtonText } from "@gluestack-ui/themed";

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
          <Divider mb="$4" />
          <Box mb="$2">
            <Text>{text}</Text>
          </Box>
        </>
      )}

      {image && (
        <Box flex={1}>
          {isImageLoading && (
            <Box
              position="absolute"
              backgroundColor="$blueGray100"
              opacity="$60"
              top="$0"
              bottom="$0"
              left="$0"
              right="$0"
              zIndex={2}
            >
              <Loader size="large" />
            </Box>
          )}
          <AnimatedView style={{ zIndex: 1 }} show={!isImageLoading}>
            <Box height={300} width="100%" flex={1}>
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
