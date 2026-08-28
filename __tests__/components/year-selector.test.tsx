import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { YearSelector } from "../../components/navigation/year-selector";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { selectSelectedYear } from "../../store/appReducer";
import { YEARS } from "@/constants";

const currentYear = YEARS[YEARS.length - 1];
const previousYear = YEARS[0];

const mockFetchUserYearData = jest.fn((args: { year: string }) => ({
  unwrap: () =>
    Promise.resolve(args.year === previousYear ? { days: {} } : null),
}));

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useLazyGetUserDataQuery: () => [mockFetchUserYearData],
}));

describe("YearSelector", () => {
  beforeEach(() => {
    mockFetchUserYearData.mockClear();
  });

  it("renders the current year when no user is logged in", () => {
    renderWithProviders(<YearSelector />);
    expect(screen.getByTestId("year-selector-label")).toBeTruthy();
    expect(screen.getByText(currentYear)).toBeTruthy();
  });

  it("opens a dropdown of available years next to the trigger", async () => {
    renderWithProviders(<YearSelector />, {
      preloadedState: loggedInPreloadedState,
    });

    await waitFor(() => {
      expect(screen.getByTestId("year-selector-trigger")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("year-selector-trigger"));

    expect(screen.getByText(previousYear)).toBeTruthy();
    expect(screen.getAllByText(currentYear).length).toBeGreaterThan(0);
  });

  it("updates the selected year from the dropdown", async () => {
    const { store } = renderWithProviders(<YearSelector />, {
      preloadedState: loggedInPreloadedState,
    });

    await waitFor(() => {
      expect(screen.getByTestId("year-selector-trigger")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("year-selector-trigger"));
    fireEvent.press(screen.getByText(previousYear));

    expect(selectSelectedYear(store.getState())).toBe(previousYear);
  });
});
