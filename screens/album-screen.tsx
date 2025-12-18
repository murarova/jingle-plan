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
import Carousel from "react-native-snap-carousel";
import { albumScreenmMonthOrder, months } from "../constants/constants";
import { AlbumScreenMonth, MonthlyData, MonthPhotoData } from "../types/types";
import { useAppSelector } from "../store/withTypes";
import { EmptyScreen } from "../components/empty-screen";
import { useTranslation } from "react-i18next";
import { useGetUserDataQuery } from "../services/api";

const { width: windowWidth } = Dimensions.get("window");
const SCREEN_PADDING = 30;
const screenWidth = windowWidth - SCREEN_PADDING * 2;

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
  <Box flex={1} width={screenWidth}>
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

type CarouselRefType = React.ComponentRef<typeof Carousel<MonthlyData>>;

export const AlbumScreen = memo(() => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<CarouselRefType>(null);

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
    carouselRef.current?.snapToNext();
  }, []);

  const handleBack = useCallback(() => {
    carouselRef.current?.snapToPrev();
  }, []);

  const handleSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const renderItem = useCallback(
    (itemProps: RenderItemProps) => <CarouselItem {...itemProps} />,
    []
  );

  if (!photos) {
    return <EmptyScreen />;
  }

  return (
    <SafeAreaView flex={1} backgroundColor="$backgroundLight50">
      <Box flex={1} pt={20} alignItems="center">
        <Carousel<MonthlyData>
          ref={carouselRef}
          sliderWidth={windowWidth}
          onSnapToItem={handleSnapToItem}
          itemWidth={screenWidth}
          data={photos}
          firstItem={activeSlide}
          renderItem={renderItem}
          vertical={false}
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
