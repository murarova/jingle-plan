import { memo, useCallback } from "react";
import { Box } from "@gluestack-ui/themed";
import { SafeAreaView } from "../../components/common/safe-area-view";
import Carousel from "react-native-reanimated-carousel";
import { EmptyScreen } from "../../components/empty-screen";
import { MonthlyData } from "../../types/types";
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
    <SafeAreaView flex={1} backgroundColor="$backgroundLight50">
      <Box
        flex={1}
        flexDirection="column"
        px={SCREEN_PADDING}
        pt="$5"
        pb="$2"
        width="100%"
      >
        <Box
          flex={1}
          width="100%"
          minHeight={0}
          onLayout={handleCarouselLayout}
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
    </SafeAreaView>
  );
});

AlbumScreen.displayName = "AlbumScreen";
