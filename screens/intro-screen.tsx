import {
  Box,
  Heading,
  Center,
  Button,
  ButtonText,
  SafeAreaView,
} from "@gluestack-ui/themed";
import { SnowAngel, Decorating, Dog, SkiingSantaSvg } from "../assets/svg";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useRef, useState, ReactNode } from "react";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "../constants/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import * as Haptics from "expo-haptics";

const { width: screenWidth } = Dimensions.get("window");
type NavigationProp = StackNavigationProp<RootStackParamList, "INTRO">;

interface IntroScreenItem {
  title: string;
  image: ReactNode;
}

export function IntroScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const data: IntroScreenItem[] = [
    {
      title: t("screens.intro.firstScreenText"),
      image: <Decorating />,
    },
    {
      title: t("screens.intro.secondScreenText"),
      image: <SnowAngel />,
    },
    {
      title: t("screens.intro.thirdScreenText"),
      image: <SkiingSantaSvg />,
    },
    {
      title: t("screens.intro.fourthScreenText"),
      image: <Dog />,
    },
  ];

  function renderItem({ item }: { item: IntroScreenItem }) {
    return (
      <Box alignItems="center">
        <Center mb="$5">{item.image}</Center>
        <Heading verticalAlign="middle" textAlign="center">
          {item.title}
        </Heading>
      </Box>
    );
  }
  return (
    <SafeAreaView flex={1}>
      <Box flex={1} justifyContent="center">
        <Box>
          <Carousel
            ref={carouselRef}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            onSnapToItem={setActiveSlide}
            itemWidth={screenWidth - 60}
            data={data}
            firstItem={activeSlide}
            renderItem={renderItem}
          />
          <Box>
            <Pagination
              dotsLength={data.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                width: 8,
                height: 8,
                borderRadius: 5,
                marginHorizontal: -2,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={1}
            />
          </Box>
        </Box>
        <Box width={screenWidth - 60} alignSelf="center">
          <Button
            onPress={async () => {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch {}
              nav.replace(SCREENS.REGISTER);
            }}
            mt="$2"
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
            mt="$2"
            variant="outline"
          >
            <ButtonText>{t("screens.intro.signupBtn")}</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
