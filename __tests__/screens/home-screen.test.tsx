import React from "react";
import { screen } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../../screens/home-screen";
import { renderWithProviders } from "../utils/render";

jest.mock("../../screens/period-overview-screen", () => {
  const { Text } = require("react-native");
  return { __esModule: true, default: () => <Text>PeriodOverviewMock</Text> };
});
jest.mock("../../screens/day-overview-screen", () => {
  const { Text } = require("react-native");
  return { __esModule: true, default: () => <Text>DayOverviewMock</Text> };
});
jest.mock("../../screens/summary-screen/summary-screen", () => ({
  SummaryScreen: () => {
    const { Text } = require("react-native");
    return <Text>SummaryMock</Text>;
  },
}));
jest.mock("../../screens/plans-screen/plans-screen", () => ({
  PlansScreen: () => {
    const { Text } = require("react-native");
    return <Text>PlansMock</Text>;
  },
}));
jest.mock("../../screens/album-screen", () => ({
  AlbumScreen: () => {
    const { Text } = require("react-native");
    return <Text>AlbumMock</Text>;
  },
}));
jest.mock("../../screens/dashboard-screen/dashboard-screen", () => ({
  DashboardScreen: () => {
    const { Text } = require("react-native");
    return <Text>DashboardMock</Text>;
  },
}));
jest.mock("../../components/year-selector", () => ({
  YearSelector: () => null,
}));
jest.mock("../../components/app-menu", () => ({
  AppMenu: () => null,
}));
jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useLazyGetUserDataQuery: () => [
    jest.fn(() => ({ unwrap: jest.fn(() => Promise.resolve(null)) })),
    { isLoading: false },
  ],
}));

function renderHomeScreen() {
  return renderWithProviders(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>,
    { withNavigation: false, withUnsavedChanges: true }
  );
}
describe("HomeScreen", () => {
  it("renders tab navigation labels", () => {
    renderHomeScreen();
    expect(screen.getByText("Головна")).toBeTruthy();
    expect(screen.getByText("Підсумки")).toBeTruthy();
    expect(screen.getByText("Плани")).toBeTruthy();
    expect(screen.getByText("Альбом")).toBeTruthy();
    expect(screen.getByText("Прогрес")).toBeTruthy();
  });
});
