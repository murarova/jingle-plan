import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { DayComponent } from "../../components/calendar/day-component";
import { renderWithProviders } from "../utils/render";

jest.mock("react-native-circular-progress-indicator", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ title }: { title?: string }) =>
      React.createElement(Text, null, title),
  };
});

const date = {
  dateString: "2025-12-10",
  day: 10,
  month: 12,
  year: 2025,
  timestamp: Date.parse("2025-12-10"),
};

describe("DayComponent", () => {
  it("sends non-subscribers to the paywall for locked days", () => {
    const navigateToPaywall = jest.fn();
    const onPress = jest.fn();
    renderWithProviders(
      <DayComponent
        date={date}
        state=""
        onPress={onPress}
        currentDate="2025-12-15"
        progress={0}
        isAdmin={false}
        isSubscriber={false}
        maxDate="2025-12-03"
        navigateToPaywall={navigateToPaywall}
      />
    );
    fireEvent.press(screen.getByTestId("calendar-day-2025-12-10"));
    expect(navigateToPaywall).toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("unlocks calendar days for store-active offer code subscribers", async () => {
    const navigateToPaywall = jest.fn();
    const onPress = jest.fn();
    renderWithProviders(
      <DayComponent
        date={date}
        state=""
        onPress={onPress}
        currentDate="2025-12-15"
        progress={0}
        isAdmin={false}
        isSubscriber={true}
        maxDate="2025-12-15"
        navigateToPaywall={navigateToPaywall}
      />
    );
    fireEvent.press(screen.getByTestId("calendar-day-2025-12-10"));
    await waitFor(() => {
      expect(onPress).toHaveBeenCalledWith("2025-12-10");
    });
    expect(navigateToPaywall).not.toHaveBeenCalled();
  });
});
