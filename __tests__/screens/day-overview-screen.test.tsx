import React from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import DayOverviewScreen from "../../screens/day-overview-screen";
import { renderWithProviders } from "../utils/render";
import { TASK_CATEGORY, TaskOutputType } from "../../constants/constants";

jest.mock("../../screens/day-overview-screen/hooks/useDayTasks", () => ({
  useDayTasks: () => require("../utils/day-overview-test-state").getDayOverviewState(),
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
      <DayOverviewScreen route={mockRoute as never} navigation={mockNavigation as never} />
    );
    expect(mockSetOptions).toHaveBeenCalledWith({ title: "01.12.2025" });
  });

  it("shows an empty state when there are no day tasks", () => {
    state.setDayOverviewState({ dayTasks: null, total: 0, error: null });
    renderWithProviders(
      <DayOverviewScreen route={mockRoute as never} navigation={mockNavigation as never} />
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
      <DayOverviewScreen route={mockRoute as never} navigation={mockNavigation as never} />
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
      <DayOverviewScreen route={mockRoute as never} navigation={mockNavigation as never} />
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
      <DayOverviewScreen route={mockRoute as never} navigation={mockNavigation as never} />
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
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText("100%")).toBeTruthy();
      expect(screen.getByText("CompletedModal")).toBeTruthy();
    });
  });
});
