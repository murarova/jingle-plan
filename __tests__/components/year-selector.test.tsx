import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { YearSelector } from "../../components/navigation/year-selector";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { selectSelectedYear } from "../../store/appReducer";
import { YEARS } from "@/constants";

const currentYear = YEARS[YEARS.length - 1];
const previousYear = YEARS[0];

describe("YearSelector", () => {
  it("renders the current year when only one year is available", () => {
    renderWithProviders(<YearSelector />);
    expect(screen.getByTestId("year-selector-label")).toBeTruthy();
    expect(screen.getByText(currentYear)).toBeTruthy();
  });

  it("opens a dropdown of available years next to the trigger", () => {
    renderWithProviders(<YearSelector />, {
      preloadedState: loggedInPreloadedState,
    });

    expect(screen.getByTestId("year-selector-trigger")).toBeTruthy();

    fireEvent.press(screen.getByTestId("year-selector-trigger"));

    expect(screen.getByText(previousYear)).toBeTruthy();
    expect(screen.getAllByText(currentYear).length).toBeGreaterThan(0);
  });

  it("updates the selected year from the dropdown", () => {
    const { store } = renderWithProviders(<YearSelector />, {
      preloadedState: loggedInPreloadedState,
    });

    fireEvent.press(screen.getByTestId("year-selector-trigger"));
    fireEvent.press(screen.getByText(previousYear));

    expect(selectSelectedYear(store.getState())).toBe(previousYear);
  });
});
