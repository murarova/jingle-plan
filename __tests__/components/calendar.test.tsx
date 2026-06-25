import React from "react";
import { screen } from "@testing-library/react-native";
import { Calendar } from "../../components/calendar/calendar";
import { renderWithProviders } from "../utils/render";

jest.mock("../../components/calendar/day-component", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    DayComponent: () => React.createElement(View, { testID: "calendar-day" }),
  };
});

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

jest.mock("../../hooks/useIAP", () => ({
  useIAP: () => ({
    isSubscriber: false,
  }),
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
  it("renders the calendar grid", () => {
    renderWithProviders(<Calendar {...defaultProps} />);
    expect(screen.getByTestId("advent-calendar")).toBeTruthy();
  });
});
