import React from "react";
import { screen } from "@testing-library/react-native";
import { IntroScreen } from "../../screens/intro-screen";
import { renderWithProviders } from "../utils/render";

const mockReplace = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: mockReplace,
      push: jest.fn(),
    }),
  };
});

jest.mock("react-native-snap-carousel", () => {
  const { View, Text } = require("react-native");
  const Carousel = ({ data, renderItem }: { data: unknown[]; renderItem: (args: { item: unknown }) => React.ReactNode }) => (
    <View testID="intro-carousel">
      {data.map((item, index) => (
        <View key={index}>{renderItem({ item })}</View>
      ))}
    </View>
  );
  const Pagination = () => <View testID="intro-pagination" />;
  return { __esModule: true, default: Carousel, Pagination };
});

jest.mock("../../assets/svg", () => ({
  SnowAngel: () => null,
  Decorating: () => null,
  Dog: () => null,
  SkiingSantaSvg: () => null,
}));

describe("IntroScreen", () => {
  it("renders carousel slides", () => {
    renderWithProviders(<IntroScreen />);
    expect(screen.getByTestId("intro-carousel")).toBeTruthy();
    expect(screen.getByTestId("intro-pagination")).toBeTruthy();
  });

  it("renders login and signup buttons", () => {
    renderWithProviders(<IntroScreen />);
    expect(screen.getByText("Створити акаунт")).toBeTruthy();
    expect(screen.getByText("Увійти")).toBeTruthy();
  });
});
