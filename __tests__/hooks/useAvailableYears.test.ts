import { renderHook, waitFor } from "@testing-library/react-native";
import { useAvailableYears } from "../../hooks/useAvailableYears";
import { createHookWrapper } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
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

describe("useAvailableYears", () => {
  beforeEach(() => {
    mockFetchUserYearData.mockClear();
  });

  it("keeps the current year when no user is logged in", () => {
    const { result } = renderHook(() => useAvailableYears(), {
      wrapper: createHookWrapper(),
    });

    expect(result.current).toEqual([currentYear]);
    expect(mockFetchUserYearData).not.toHaveBeenCalled();
  });

  it("loads years that have user data once for the logged-in user", async () => {
    const { result } = renderHook(() => useAvailableYears(), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    await waitFor(() => {
      expect(result.current).toEqual(
        expect.arrayContaining([previousYear, currentYear]),
      );
    });

    expect(mockFetchUserYearData).toHaveBeenCalled();
  });
});
