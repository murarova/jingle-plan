import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { PlansScreen } from "../../screens/plans-screen/plans-screen";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import {
  mockGetUserDataQuery,
  mockSaveTaskByCategoryMutation,
  resetApiHookMocks,
} from "../mocks/api-hooks";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useLazyGetUserDataQuery: () => [
    jest.fn(() => ({ unwrap: () => Promise.resolve(null) })),
    { isLoading: false },
  ],
}));

jest.mock("../../components/modals/month-select-modal", () => ({
  MonthSelectModal: () => null,
}));

const setUserData = (data: unknown) => {
  mockGetUserDataQuery.mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: jest.fn(),
  });
};

describe("PlansScreen", () => {
  beforeEach(() => {
    resetApiHookMocks();
  });

  it("shows the empty screen when there are no plans or global goal", () => {
    setUserData(null);
    renderWithProviders(<PlansScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  it("shows the global goal when only goals exist", () => {
    setUserData({
      goals: { globalGoal: { id: "g1", text: "Run a marathon" } },
    });
    renderWithProviders(<PlansScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Run a marathon")).toBeTruthy();
    expect(screen.getByText("Моя глобальна мета 2026:")).toBeTruthy();
    expect(screen.queryByTestId("view-switch-selector")).toBeNull();
  });

  describe("with plans", () => {
    beforeEach(() => {
      setUserData({
        plans: {
          health: [
            { id: "h1", text: "Morning run", isDone: false },
            { id: "h2", text: "Yoga session", isDone: true },
          ],
        },
        goals: { globalGoal: { id: "g1", text: "Stay healthy" } },
      });
    });

    it("renders the view switch, global goal, and context headers", () => {
      renderWithProviders(<PlansScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByTestId("view-switch-selector")).toBeTruthy();
      expect(screen.getByText("По сферах")).toBeTruthy();
      expect(screen.getByText("По місяцях")).toBeTruthy();
      expect(screen.getByText("Stay healthy")).toBeTruthy();
      expect(screen.getByText("Тіло")).toBeTruthy();
    });

    it("opens the add-plan modal when the FAB is pressed", () => {
      renderWithProviders(<PlansScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      const buttons = screen.getAllByRole("button");
      fireEvent.press(buttons[buttons.length - 1]);
      expect(screen.getByText("Додайте один пункт плану")).toBeTruthy();
    });
  });
});
