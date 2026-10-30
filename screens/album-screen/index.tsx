import { Box } from "@/ui/box";
import { memo, useCallback } from "react";
import Carousel from "react-native-reanimated-carousel";
import { EmptyScreen } from "../../components/common/empty-screen";
import { MonthlyData } from "@/types";
import { AlbumCarouselItem } from "./album-carousel-item";
import { AlbumNavigationControls } from "./album-navigation-controls";
import { SCREEN_PADDING } from "./constants";
import { useAlbumScreen } from "./hooks/useAlbumScreen";

export const AlbumScreen = memo(() => {
  const {
    carouselRef,
    carouselSize,
    photos,
    currentMonth,
    handleCarouselLayout,
    handleForward,
    handleBack,
    handleSnapToItem,
  } = useAlbumScreen();

  const renderItem = useCallback(
    ({ item }: { item: MonthlyData }) => <AlbumCarouselItem item={item} />,
    [],
  );

  if (!photos) {
    return <EmptyScreen />;
  }

  return (
    <Box className="flex-1">
      <Box
        className="flex-1 flex-col py-5 w-full"
        style={{ paddingHorizontal: SCREEN_PADDING }}
      >
        <Box
          onLayout={handleCarouselLayout}
          className="min-h-0 w-full flex-1 overflow-hidden rounded-[20px]"
        >
          {carouselSize.height > 0 && (
            <Carousel
              ref={carouselRef}
              loop={false}
              pagingEnabled
              snapEnabled
              style={{
                width: carouselSize.width,
                height: carouselSize.height,
              }}
              itemWidth={carouselSize.width}
              data={photos}
              onSnapToItem={handleSnapToItem}
              renderItem={renderItem}
            />
          )}
        </Box>
        <AlbumNavigationControls
          onBack={handleBack}
          onForward={handleForward}
          currentMonth={currentMonth}
        />
      </Box>
    </Box>
  );
});

AlbumScreen.displayName = "AlbumScreen";
