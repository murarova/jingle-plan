import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import PeriodOverviewScreen from "../../screens/period-overview-screen";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { mockNavigate, resetNavigationMocks } from "../mocks/navigation";
import { SCREENS } from "@/constants";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

const mockRefresh = jest.fn();
const mockGetDayConfig = jest.fn();

jest.mock("../../hooks/useCalendarDayManager", () => ({
  useCalendarDayManager: () => ({
    refresh: mockRefresh,
    isLoading: false,
    getDayConfig: mockGetDayConfig,
    isAdmin: false,
  }),
}));

jest.mock("../../hooks/useCurrentDate", () => ({
  useCurrentDate: () => ["2025-12-15", jest.fn()],
}));

jest.mock("../../components/calendar/calendar", () => ({
  Calendar: ({
    pressHandler,
  }: {
    pressHandler: (date: string) => void;
  }) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable
        testID="calendar-press"
        onPress={() => pressHandler("2025-12-01")}
      >
        <Text>CalendarMock</Text>
      </Pressable>
    );
  },
}));

const mockUseIAP = jest.fn(() => ({
  isSubscriber: false,
  isSubscriptionResolved: true,
}));

jest.mock("../../hooks/useIAP", () => ({
  useIAP: () => mockUseIAP(),
}));

describe("PeriodOverviewScreen", () => {
  beforeEach(() => {
    resetNavigationMocks();
    mockRefresh.mockClear();
    mockUseIAP.mockReturnValue({
      isSubscriber: false,
      isSubscriptionResolved: true,
    });
  });

  it("renders the calendar", () => {
    renderWithProviders(<PeriodOverviewScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("CalendarMock")).toBeTruthy();
  });

  it("navigates to the day overview when a calendar day is pressed", () => {
    renderWithProviders(<PeriodOverviewScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    fireEvent.press(screen.getByTestId("calendar-press"));
    expect(mockNavigate).toHaveBeenCalledWith("DayOverview", {
      currentDay: "2025-12-01",
    });
  });

  it("shows the paywall banner for non-subscribers on the current year", () => {
    renderWithProviders(<PeriodOverviewScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Відкрий усі дні з Jingle Plan+")).toBeTruthy();
    expect(screen.getByText("Оформити підписку")).toBeTruthy();
  });

  it("hides the paywall banner for subscribers", () => {
    mockUseIAP.mockReturnValue({
      isSubscriber: true,
      isSubscriptionResolved: true,
    });

    renderWithProviders(<PeriodOverviewScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.queryByText("Відкрий усі дні з Jingle Plan+")).toBeNull();
  });

  it("navigates to the paywall screen from the banner", () => {
    renderWithProviders(<PeriodOverviewScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    fireEvent.press(screen.getByText("Оформити підписку"));
    expect(mockNavigate).toHaveBeenCalledWith(SCREENS.PAYWALL);
  });
});
