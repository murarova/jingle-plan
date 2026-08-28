import React from "react";
import { screen } from "@testing-library/react-native";
import { Calendar } from "../../components/calendar/calendar";
import { renderWithProviders } from "../utils/render";

const mockCapturedMaxDates: string[] = [];

jest.mock("../../components/calendar/day-component", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    DayComponent: ({ maxDate }: { maxDate: string }) => {
      mockCapturedMaxDates.push(maxDate);
      return React.createElement(View, { testID: "calendar-day" });
    },
  };
});

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

const mockUseIAP = jest.fn(() => ({
  isSubscriber: false,
}));

jest.mock("../../hooks/useIAP", () => ({
  useIAP: () => mockUseIAP(),
}));

const defaultProps = {
  pressHandler: jest.fn(),
  getDayConfig: jest.fn(() => null),
  isAdmin: false,
  isLoading: false,
  currentYear: "2025",
  currentDate: "2025-12-15",
};

describe("Calendar", () => {
  beforeEach(() => {
    mockCapturedMaxDates.length = 0;
    mockUseIAP.mockReturnValue({ isSubscriber: false });
  });

  it("renders the calendar grid", () => {
    renderWithProviders(<Calendar {...defaultProps} />);
    expect(screen.getByTestId("advent-calendar")).toBeTruthy();
  });

  it("renders for store-active offer code subscribers", () => {
    mockUseIAP.mockReturnValue({ isSubscriber: true });
    renderWithProviders(<Calendar {...defaultProps} />);
    expect(screen.getByTestId("advent-calendar")).toBeTruthy();
  });

  it("keeps the first three days unlocked for subscribers before 3 December", () => {
    mockUseIAP.mockReturnValue({ isSubscriber: true });
    renderWithProviders(
      <Calendar {...defaultProps} currentDate="2025-12-01" />
    );
    expect(mockCapturedMaxDates[0]).toBe("2025-12-03");
  });

  it("unlocks later days for subscribers once they have arrived", () => {
    mockUseIAP.mockReturnValue({ isSubscriber: true });
    renderWithProviders(
      <Calendar {...defaultProps} currentDate="2025-12-15" />
    );
    expect(mockCapturedMaxDates[0]).toBe("2025-12-15");
  });
});
