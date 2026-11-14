import React from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { logEvent } from "@react-native-firebase/analytics";
import DayOverviewScreen from "../../screens/day-overview-screen";
import { renderWithProviders } from "../utils/render";
import { TASK_CATEGORY, TaskOutputType } from "@/constants";

jest.mock("../../screens/day-overview-screen/hooks/useDayTasks", () => ({
  useDayTasks: () =>
    require("../utils/day-overview-test-state").getDayOverviewState(),
}));

jest.mock("../../components/tasks/tasks-list", () => ({
  TasksList: () => {
    const { Text } = require("react-native");
    return <Text>TasksListMock</Text>;
  },
}));

jest.mock("../../components/modals/completed-task-modal", () => ({
  CompletedTaskModal: () => {
    const { Text } = require("react-native");
    return <Text>CompletedModal</Text>;
  },
}));

const mockSetOptions = jest.fn();
const mockRoute = { params: { currentDay: "2025-12-01" } };
const mockNavigation = { setOptions: mockSetOptions };

describe("DayOverviewScreen", () => {
  const state = require("../utils/day-overview-test-state");

  beforeEach(() => {
    state.resetDayOverviewState();
    mockSetOptions.mockClear();
  });

  it("sets the navigation title from the current day", () => {
    renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );
    expect(mockSetOptions).toHaveBeenCalledWith({
      title: "01.12.2025",
      headerStyle: { backgroundColor: "#F4F0E6" },
      headerShadowVisible: false,
      cardStyle: { backgroundColor: "#F4F0E6" },
    });
  });

  it("logs day_opened once with progress after the data has loaded", () => {
    (logEvent as jest.Mock).mockClear();
    state.setDayOverviewState({ dayTasks: null, total: 0, isLoading: true });
    const view = renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );
    expect(logEvent).not.toHaveBeenCalled();

    state.setDayOverviewState({
      dayTasks: { config: {}, progress: {} },
      total: 50,
      isLoading: false,
    });
    view.rerender(
      <DayOverviewScreen
        route={{ params: { ...mockRoute.params } } as never}
        navigation={mockNavigation as never}
      />,
    );
    view.rerender(
      <DayOverviewScreen
        route={{ params: { ...mockRoute.params } } as never}
        navigation={mockNavigation as never}
      />,
    );

    const opened = (logEvent as jest.Mock).mock.calls.filter(
      (call) => call[1] === "day_opened",
    );
    expect(opened).toHaveLength(1);
    expect(opened[0][2]).toEqual({
      day_number: 1,
      program_year: 2025,
      progress_percent: 50,
    });
  });

  it("shows an empty state when there are no day tasks", () => {
    state.setDayOverviewState({ dayTasks: null, total: 0, error: null });
    renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  it("renders progress and tasks when day data exists", () => {
    state.setDayOverviewState({
      dayTasks: {
        config: {
          videoText: "Watch this",
          videoId: "abc",
          dayTaskConfig: {
            category: TASK_CATEGORY.SUMMARY,
            grade: 1,
            context: "health",
            taskOutputType: TaskOutputType.Text,
            text: "Day task",
            title: "Title",
          },
          moodTaskConfig: {
            category: TASK_CATEGORY.MOOD,
            grade: 1,
            context: "health",
            taskOutputType: TaskOutputType.Text,
            text: "Mood task",
            title: "Mood",
          },
        },
      },
      total: 42,
      error: null,
    });

    renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );
    expect(screen.getByText("42%")).toBeTruthy();
    expect(screen.getByText("TasksListMock")).toBeTruthy();
  });

  it("shows an error state with retry", () => {
    const mockRefresh = jest.fn();
    state.setDayOverviewState({
      dayTasks: null,
      total: 0,
      error: new Error("failed"),
      refresh: mockRefresh,
    });

    renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );
    fireEvent.press(screen.getByText("Retry"));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("shows the completed modal when progress reaches 100%", async () => {
    state.setDayOverviewState({
      dayTasks: { config: {} },
      total: 80,
      error: null,
    });

    const view = renderWithProviders(
      <DayOverviewScreen
        route={mockRoute as never}
        navigation={mockNavigation as never}
      />,
    );

    act(() => {
      state.setDayOverviewState({
        dayTasks: { config: {} },
        total: 100,
        error: null,
      });
    });

    act(() => {
      view.rerender(
        <DayOverviewScreen
          route={{ params: { currentDay: "2025-12-01" } } as never}
          navigation={mockNavigation as never}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("100%")).toBeTruthy();
      expect(screen.getByText("CompletedModal")).toBeTruthy();
    });
  });
});
