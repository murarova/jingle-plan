import { useState, useCallback, useMemo, memo, useRef } from "react";
import { Dimensions, ImageStyle } from "react-native";
import {
  Box,
  Button,
  Text,
  Center,
  ScrollView,
  ChevronRightIcon,
  ButtonIcon,
  ChevronLeftIcon,
  SafeAreaView,
  Image,
} from "@gluestack-ui/themed";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { albumScreenmMonthOrder, months } from "../constants/constants";
import { AlbumScreenMonth, MonthlyData, MonthPhotoData } from "../types/types";
import { useAppSelector } from "../store/withTypes";
import { EmptyScreen } from "../components/empty-screen";
import { useTranslation } from "react-i18next";
import { useGetUserDataQuery } from "../services/api";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const SCREEN_PADDING = 30;
const screenWidth = windowWidth - SCREEN_PADDING * 2;
const carouselHeight = windowHeight * 0.55;

interface RenderItemProps {
  item: MonthlyData;
  index: number;
}

const imageStyle: ImageStyle = {
  flex: 1,
  width: undefined,
  height: undefined,
  resizeMode: "contain",
};

const CarouselItem = memo(({ item }: RenderItemProps) => (
  <Box flex={1} width={screenWidth} height={carouselHeight}>
    <Box
      flexGrow={1}
      backgroundColor="$white"
      p={10}
      borderTopRightRadius={8}
      borderTopLeftRadius={8}
      borderBottomRightRadius={item.text ? 0 : 8}
      borderBottomLeftRadius={item.text ? 0 : 8}
    >
      <Image
        source={{ uri: item?.image?.uri }}
        style={imageStyle}
        alt={`Photo for ${item.month}`}
      />
    </Box>
    {item.text && (
      <ScrollView
        flexBasis="30%"
        p={10}
        flexGrow={0}
        backgroundColor="$white"
        borderBottomRightRadius={8}
        borderBottomLeftRadius={8}
      >
        <Text pb="$4">{item.text}</Text>
      </ScrollView>
    )}
  </Box>
));

CarouselItem.displayName = "CarouselItem";

interface NavigationControlsProps {
  onBack: () => void;
  onForward: () => void;
  currentMonth: string;
}

const NavigationControls = memo(
  ({ onBack, onForward, currentMonth }: NavigationControlsProps) => (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      width={screenWidth}
      borderRadius="$full"
      mt="$2"
      mb="$5"
      px="$5"
      backgroundColor="$white"
    >
      <Button onPress={onBack} size="xl" variant="link">
        <ButtonIcon color="$warmGray800" as={ChevronLeftIcon} />
      </Button>
      <Center>
        <Text verticalAlign="middle" fontWeight={600}>
          {currentMonth}
        </Text>
      </Center>
      <Button onPress={onForward} size="xl" variant="link">
        <ButtonIcon color="$warmGray800" as={ChevronRightIcon} />
      </Button>
    </Box>
  )
);

NavigationControls.displayName = "NavigationControls";

const mapDataToCarousel = (inputDict: MonthPhotoData): MonthlyData[] => {
  const outputList = Object.entries(inputDict).reduce<MonthlyData[]>(
    (acc, [month, data]) => {
      if (data) {
        acc.push({
          month: month as AlbumScreenMonth,
          id: data.id,
          image: data.image,
          text: data.text,
        });
      }
      return acc;
    },
    []
  );

  return outputList.sort(
    (a, b) =>
      albumScreenmMonthOrder.indexOf(a.month) -
      albumScreenmMonthOrder.indexOf(b.month)
  );
};

export const AlbumScreen = memo(() => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );
  const monthPhoto = userData?.monthPhoto as MonthPhotoData | null;

  const photos = useMemo(
    () => (monthPhoto ? mapDataToCarousel(monthPhoto) : null),
    [monthPhoto]
  );

  const currentMonth = useMemo(() => {
    if (!photos?.[activeSlide]?.month) return t("common.year");
    const month = months.find((m) => m.value === photos[activeSlide].month);
    return month?.long || t("common.year");
  }, [photos, activeSlide, t]);

  const handleForward = useCallback(() => {
    carouselRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  const handleSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: RenderItemProps) => (
      <CarouselItem item={item} index={index} />
    ),
    []
  );

  if (!photos) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1} backgroundColor="$backgroundLight50">
      <Box flex={1} pt={20} alignItems="center">
        <Carousel
          ref={carouselRef}
          loop={false}
          pagingEnabled
          snapEnabled
          style={{ width: windowWidth, height: carouselHeight }}
          itemWidth={screenWidth}
          data={photos}
          onSnapToItem={handleSnapToItem}
          renderItem={renderItem}
        />
        <NavigationControls
          onBack={handleBack}
          onForward={handleForward}
          currentMonth={currentMonth}
        />
      </Box>
    </SafeAreaView>
  );
});

AlbumScreen.displayName = "AlbumScreen";
