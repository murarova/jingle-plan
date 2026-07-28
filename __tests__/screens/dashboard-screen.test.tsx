import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { DashboardScreen } from "../../screens/dashboard-screen/dashboard-screen";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { mockGetUserDataQuery, resetApiHookMocks } from "../mocks/api-hooks";
import { mockNavigate, resetNavigationMocks } from "../mocks/navigation";
import { SCREENS } from "../../constants/constants";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
}));

jest.mock("react-native-circular-progress-indicator", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  const MockProgress = ({
    value,
    children,
  }: {
    value: number;
    children?: React.ReactNode;
  }) => (
    <View testID="circular-progress">
      {children ?? <Text>{`${value}%`}</Text>}
    </View>
  );
  return {
    __esModule: true,
    default: MockProgress,
    CircularProgressBase: MockProgress,
  };
});

const setUserData = (data: unknown) => {
  mockGetUserDataQuery.mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: jest.fn(),
  });
};

describe("DashboardScreen", () => {
  beforeEach(() => {
    resetApiHookMocks();
    resetNavigationMocks();
  });

  it("shows the empty screen when there are no plans", () => {
    setUserData(null);
    renderWithProviders(<DashboardScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  it("shows the empty screen when all progress is zero", () => {
    setUserData({ plans: { health: [] } });
    renderWithProviders(<DashboardScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  describe("with populated plans", () => {
    beforeEach(() => {
      setUserData({
        plans: {
          health: [
            { id: "h1", text: "Run", isDone: true },
            { id: "h2", text: "Stretch", isDone: false },
          ],
          work: [{ id: "w1", text: "Ship feature", isDone: true }],
        },
      });
    });

    it("renders aggregate stats", () => {
      renderWithProviders(<DashboardScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("67%")).toBeTruthy();
      expect(screen.getByText("Виконано")).toBeTruthy();
    });

    it("renders a section per context with data", () => {
      renderWithProviders(<DashboardScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("Тіло")).toBeTruthy();
      expect(screen.getByText("Сродна праця")).toBeTruthy();
    });

    it("navigates to the plans tab when a context section is pressed", () => {
      renderWithProviders(<DashboardScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Тіло"));
      expect(mockNavigate).toHaveBeenCalledWith(SCREENS.HOME, {
        screen: SCREENS.PLANS,
      });
    });
  });
});
