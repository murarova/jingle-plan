import { AppButton } from "@/components/common";
import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Pressable } from "@/ui/pressable";
import { SafeAreaView } from "../../components/common/safe-area-view";
import { SnowAngel, Dog, SkiingSantaSvg, Decorating } from "../../assets/svg";
import Carousel from "react-native-reanimated-carousel";
import { useCallback, useMemo, useState, ComponentType } from "react";
import { LayoutChangeEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "@/constants";
import { colors } from "@/constants/colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation/types";
import * as Haptics from "expo-haptics";
import { SvgProps } from "react-native-svg";

const ILLUSTRATION_SIZE = 288;
const INACTIVE_DOT = "#D8D1C3";

type NavigationProp = StackNavigationProp<RootStackParamList, "INTRO">;

interface IntroScreenItem {
  title: string;
  Image: ComponentType<SvgProps>;
}

export function IntroScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });

  const data = useMemo<IntroScreenItem[]>(
    () => [
      { title: t("screens.intro.firstScreenText"), Image: Decorating },
      { title: t("screens.intro.secondScreenText"), Image: SnowAngel },
      { title: t("screens.intro.thirdScreenText"), Image: SkiingSantaSvg },
      { title: t("screens.intro.fourthScreenText"), Image: Dog },
    ],
    [t],
  );

  const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;

    setCarouselSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  }, []);

  const sceneScale =
    carouselSize.width > 0
      ? Math.min(1, (carouselSize.width - 56) / ILLUSTRATION_SIZE)
      : 1;

  const renderItem = useCallback(
    ({ item }: { item: IntroScreenItem }) => {
      const Image = item.Image;

      return (
        <Box className="h-full w-full items-center justify-center">
          <Box className="h-[344px] max-h-full w-full items-center justify-center overflow-hidden rounded-[32px] border border-ivory-line bg-ivory-card">
            <Box
              style={{ transform: [{ scale: sceneScale }] }}
              className="items-center justify-center"
            >
              <Image width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} />
            </Box>
          </Box>
        </Box>
      );
    },
    [sceneScale],
  );

  function openScreen(
    screen: typeof SCREENS.REGISTER | typeof SCREENS.LOGIN,
    impact: Haptics.ImpactFeedbackStyle,
  ) {
    return async () => {
      try {
        await Haptics.impactAsync(impact);
      } catch {}
      nav.replace(screen);
    };
  }

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 justify-between">
        <Box className="w-full shrink gap-9 px-6 pt-[53px]">
          <Box
            onLayout={handleCarouselLayout}
            className="h-[344px] w-full shrink"
            testID="intro-carousel-layout"
          >
            {carouselSize.height > 0 && (
              <Carousel
                loop={false}
                pagingEnabled
                snapEnabled
                style={{
                  width: carouselSize.width,
                  height: carouselSize.height,
                }}
                itemWidth={carouselSize.width}
                data={data}
                onSnapToItem={setActiveIndex}
                renderItem={renderItem}
                testID="intro-carousel"
              />
            )}
          </Box>
          <Box className="w-full items-center gap-3">
            <Text
              className="w-full text-center text-primaryText"
              style={{
                fontSize: 32,
                lineHeight: 40,
                fontWeight: "700",
              }}
            >
              {t("screens.intro.brand")}
            </Text>
            <Text
              className="w-full text-center"
              style={{
                fontSize: 17,
                lineHeight: 24,
                color: "#756e63",
              }}
            >
              {data[activeIndex]?.title}
            </Text>
          </Box>
        </Box>
        <Box className="w-full gap-8">
          <Box
            className="flex-row items-center justify-center gap-2"
            testID="intro-pagination"
          >
            {data.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <Box
                  key={item.title}
                  className={
                    isActive
                      ? "h-[7px] w-6 rounded-full"
                      : "h-[7px] w-[7px] rounded-full"
                  }
                  style={{
                    backgroundColor: isActive ? colors.green400 : INACTIVE_DOT,
                  }}
                />
              );
            })}
          </Box>
          <Box className="w-full gap-3 px-6">
            <AppButton
              label={t("screens.intro.loginBtn")}
              onPress={openScreen(
                SCREENS.REGISTER,
                Haptics.ImpactFeedbackStyle.Medium,
              )}
              className="w-full"
            />
            <Pressable
              accessibilityRole="button"
              onPress={openScreen(
                SCREENS.LOGIN,
                Haptics.ImpactFeedbackStyle.Light,
              )}
              className="h-[52px] items-center justify-center"
            >
              <Text
                className="text-center text-primaryText"
                style={{
                  fontSize: 17,
                  lineHeight: 24,
                  fontWeight: "600",
                }}
              >
                {t("screens.intro.signupBtn")}
              </Text>
            </Pressable>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
