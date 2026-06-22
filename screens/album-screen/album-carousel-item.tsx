import { memo } from "react";
import { ImageStyle } from "react-native";
import { Box, Text, ScrollView, Image } from "@gluestack-ui/themed";
import { MonthlyData } from "../../types/types";

interface AlbumCarouselItemProps {
  item: MonthlyData;
}

const imageStyle: ImageStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
  resizeMode: "contain",
};

export const AlbumCarouselItem = memo(({ item }: AlbumCarouselItemProps) => {
  const hasText = Boolean(item.text);

  return (
    <Box flex={1} width="100%" height="100%" flexDirection="column">
      <Box
        height={hasText ? "70%" : "100%"}
        backgroundColor="$white"
        p={10}
        borderTopRightRadius={8}
        borderTopLeftRadius={8}
        borderBottomRightRadius={hasText ? 0 : 8}
        borderBottomLeftRadius={hasText ? 0 : 8}
        overflow="hidden"
      >
        <Image
          source={{ uri: item?.image?.uri }}
          style={imageStyle}
          alt={`Photo for ${item.month}`}
        />
      </Box>
      {hasText && (
        <Box
          height="30%"
          backgroundColor="$white"
          borderBottomRightRadius={8}
          borderBottomLeftRadius={8}
          overflow="hidden"
        >
          <ScrollView flex={1} p={10} showsVerticalScrollIndicator={false}>
            <Text>{item.text}</Text>
          </ScrollView>
        </Box>
      )}
    </Box>
  );
});

AlbumCarouselItem.displayName = "AlbumCarouselItem";
