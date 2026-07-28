import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "../components/common/safe-area-view";
import { SnowAngel, Decorating, Dog, SkiingSantaSvg } from "../assets/svg";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useCallback, useRef, useState, ComponentType } from "react";
import { LayoutChangeEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "../constants/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import * as Haptics from "expo-haptics";
import { useSharedValue } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

const SCREEN_PADDING = 30;
const TITLE_AREA = 72;

type NavigationProp = StackNavigationProp<RootStackParamList, "INTRO">;

interface IntroScreenItem {
  title: string;
  Image: ComponentType<SvgProps>;
}

export function IntroScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();
  const carouselRef = useRef(null);
  const progress = useSharedValue(0);
  const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });

  const data: IntroScreenItem[] = [
    {
      title: t("screens.intro.firstScreenText"),
      Image: Decorating,
    },
    {
      title: t("screens.intro.secondScreenText"),
      Image: SnowAngel,
    },
    {
      title: t("screens.intro.thirdScreenText"),
      Image: SkiingSantaSvg,
    },
    {
      title: t("screens.intro.fourthScreenText"),
      Image: Dog,
    },
  ];

  const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;

    setCarouselSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  }, []);

  const imageSize = Math.max(
    0,
    Math.min(carouselSize.width, carouselSize.height - TITLE_AREA),
  );

  const renderItem = useCallback(
    ({ item }: { item: IntroScreenItem }) => {
      const Image = item.Image;

      return (
        <Box className="flex-1 w-full items-center justify-center">
          <Center className="mb-5" style={{ width: imageSize, height: imageSize }}>
            <Image width={imageSize} height={imageSize} />
          </Center>
          <Heading className="align-middle text-center">{item.title}</Heading>
        </Box>
      );
    },
    [imageSize],
  );

  return (
    <SafeAreaView className="flex-1">
      <Box
        className="flex-1 w-full pt-5 pb-2"
        style={{ paddingHorizontal: SCREEN_PADDING }}
      >
        <Box
          onLayout={handleCarouselLayout}
          className="flex-1 w-full min-h-0"
          testID="intro-carousel-layout"
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
              data={data}
              onProgressChange={progress}
              renderItem={renderItem}
              testID="intro-carousel"
            />
          )}
        </Box>
        <Box>
          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
            activeDotStyle={{
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            }}
            containerStyle={{ gap: 8, marginTop: 8, marginBottom: 8 }}
          />
        </Box>
        <Box className="w-full">
          <Button
            onPress={async () => {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch {}
              nav.replace(SCREENS.REGISTER);
            }}
            className="mt-2"
          >
            <ButtonText>{t("screens.intro.loginBtn")}</ButtonText>
          </Button>
          <Button
            onPress={async () => {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              nav.replace(SCREENS.LOGIN);
            }}
            variant="outline"
            className="mt-2"
          >
            <ButtonText>{t("screens.intro.signupBtn")}</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
