import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { IntroScreen } from "../../screens/intro-screen";
import { renderWithProviders } from "../utils/render";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

jest.mock("react-native-reanimated-carousel", () => {
  const { View } = require("react-native");
  const Carousel = ({
    data,
    renderItem,
    testID,
  }: {
    data: unknown[];
    renderItem: (args: { item: unknown; index: number }) => React.ReactNode;
    testID?: string;
  }) => (
    <View testID={testID ?? "intro-carousel"}>
      {data.map((item, index) => (
        <View key={index}>{renderItem({ item, index })}</View>
      ))}
    </View>
  );
  const Pagination = {
    Basic: () => {
      const { View } = require("react-native");
      return <View testID="intro-pagination" />;
    },
  };
  return { __esModule: true, default: Carousel, Pagination };
});

jest.mock("../../assets/svg", () => ({
  SnowAngel: () => null,
  Decorating: () => null,
  Dog: () => null,
  SkiingSantaSvg: () => null,
}));

const layoutCarousel = () => {
  fireEvent(screen.getByTestId("intro-carousel-layout"), "layout", {
    nativeEvent: { layout: { width: 300, height: 400, x: 0, y: 0 } },
  });
};

describe("IntroScreen", () => {
  it("renders carousel slides", () => {
    renderWithProviders(<IntroScreen />);
    layoutCarousel();
    expect(screen.getByTestId("intro-carousel")).toBeTruthy();
    expect(screen.getByTestId("intro-pagination")).toBeTruthy();
  });

  it("renders login and signup buttons", () => {
    renderWithProviders(<IntroScreen />);
    layoutCarousel();
    expect(screen.getByText("Створити акаунт")).toBeTruthy();
    expect(screen.getByText("Увійти")).toBeTruthy();
  });
});
