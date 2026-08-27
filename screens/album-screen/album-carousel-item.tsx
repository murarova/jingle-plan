import { Image } from "@/ui/image";
import { Box } from "@/ui/box";
import { memo } from "react";
import { ImageStyle } from "react-native";
import { MonthlyData } from "@/types";
import { AlbumItemText } from "./album-item-text";

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
      {item.text ? <AlbumItemText text={item.text} /> : null}
    </Box>
  );
});

AlbumCarouselItem.displayName = "AlbumCarouselItem";
