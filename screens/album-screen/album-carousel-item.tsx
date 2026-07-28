import { Image } from "@/ui/image";
import { ScrollView } from "@/ui/scroll-view";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import { ImageStyle } from "react-native";
import { MonthlyData } from "@/types";

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
    <Box className="flex-1 w-full h-full flex-col">
      <Box
        className={`${hasText ? "h-[70%]" : "flex-1"} bg-white p-[10px] overflow-hidden`}
        style={{
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          borderBottomRightRadius: hasText ? 0 : 8,
          borderBottomLeftRadius: hasText ? 0 : 8,
        }}
      >
        <Image
          source={{ uri: item?.image?.uri }}
          size="full"
          style={imageStyle}
          alt={`Photo for ${item.month}`}
        />
      </Box>
      {hasText && (
        <Box
          className="h-[30%] bg-white overflow-hidden"
          style={{
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-[10px]">
            <Text>{item.text}</Text>
          </ScrollView>
        </Box>
      )}
    </Box>
  );
});

AlbumCarouselItem.displayName = "AlbumCarouselItem";
