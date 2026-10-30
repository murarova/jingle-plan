import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { PlansScreen } from "../../screens/plans-screen";
import { PlansHeaderActions } from "../../screens/plans-screen/components/plans-header-actions";
import { PlansSearchProvider } from "../../screens/plans-screen/plans-search-context";
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

jest.mock("../../components/navigation/app-menu", () => ({
  AppMenu: () => null,
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
    renderWithProviders(
      <PlansSearchProvider>
        <PlansScreen />
      </PlansSearchProvider>,
      {
        preloadedState: loggedInPreloadedState,
      },
    );
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  it("shows the global goal when only goals exist", () => {
    setUserData({
      goals: { globalGoal: { id: "g1", text: "Run a marathon" } },
    });
    renderWithProviders(
      <PlansSearchProvider>
        <PlansScreen />
      </PlansSearchProvider>,
      {
        preloadedState: loggedInPreloadedState,
      },
    );
    expect(screen.getByText("Run a marathon")).toBeTruthy();
    expect(screen.getByText("Моя глобальна мета 2026:")).toBeTruthy();
    expect(screen.queryByTestId("view-switch-selector")).toBeNull();
  });

  it("hides the header search icon when there are no plans", () => {
    setUserData({
      goals: { globalGoal: { id: "g1", text: "Run a marathon" } },
    });
    renderWithProviders(
      <PlansSearchProvider>
        <PlansHeaderActions />
      </PlansSearchProvider>,
      {
        preloadedState: loggedInPreloadedState,
      },
    );
    expect(screen.queryByTestId("plans-search-toggle")).toBeNull();
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

    it("renders the view switch, search, global goal, and context headers", () => {
      renderWithProviders(
        <PlansSearchProvider>
          <PlansHeaderActions />
          <PlansScreen />
        </PlansSearchProvider>,
        {
          preloadedState: loggedInPreloadedState,
        },
      );
      expect(screen.getByTestId("view-switch-selector")).toBeTruthy();
      expect(screen.getByText("По сферах")).toBeTruthy();
      expect(screen.getByText("По місяцях")).toBeTruthy();
      expect(screen.getByTestId("plans-search-toggle")).toBeTruthy();
      expect(screen.queryByTestId("plans-search")).toBeNull();
      expect(screen.getByText("Stay healthy")).toBeTruthy();
      expect(screen.getByText("Тіло")).toBeTruthy();
      expect(screen.getByText("Morning run")).toBeTruthy();
    });

    it("expands categories that match the search", () => {
      setUserData({
        plans: {
          health: [{ id: "h1", text: "Morning run", isDone: false }],
          work: [{ id: "w1", text: "Quarterly review", isDone: false }],
        },
        goals: { globalGoal: { id: "g1", text: "Stay healthy" } },
      });
      renderWithProviders(
        <PlansSearchProvider>
          <PlansHeaderActions />
          <PlansScreen />
        </PlansSearchProvider>,
        {
          preloadedState: loggedInPreloadedState,
        },
      );

      expect(screen.getByRole("button", { name: /Сродна праця/ })).toHaveAccessibilityState({
        expanded: false,
      });

      fireEvent.press(screen.getByTestId("plans-search-toggle"));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light,
      );
      fireEvent.changeText(screen.getByTestId("plans-search"), "Quarterly");

      expect(screen.getByRole("button", { name: /Сродна праця/ })).toHaveAccessibilityState({
        expanded: true,
      });
      expect(screen.getByText("Quarterly review")).toBeTruthy();
    });

    it("opens the add-plan modal when the FAB is pressed", () => {
      renderWithProviders(
        <PlansSearchProvider>
          <PlansScreen />
        </PlansSearchProvider>,
        {
          preloadedState: loggedInPreloadedState,
        },
      );
      fireEvent.press(screen.getByTestId("plans-add-button"));
      expect(screen.getByText("Додайте один пункт плану")).toBeTruthy();
    });
  });
});
