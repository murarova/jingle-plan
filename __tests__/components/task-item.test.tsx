import React from "react";
import { screen } from "@testing-library/react-native";
import { TaskItem } from "../../components/task-item";
import { renderWithProviders } from "../utils/render";
import { mockGetUserDataQuery } from "../mocks/api-hooks";
import { TASK_CATEGORY, TaskOutputType } from "../../constants/constants";
import type { DayTaskConfig } from "../../types/types";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
}));

jest.mock("../../components/day-tasks/plans/plans", () => ({
  Plans: () => null,
}));
jest.mock("../../components/day-tasks/summary/summary", () => ({
  Summary: () => null,
}));
jest.mock("../../components/day-tasks/month-photo/month-photo", () => ({
  MonthPhoto: () => null,
}));
jest.mock("../../components/day-tasks/mood/mood-task", () => ({
  MoodTask: () => null,
}));
jest.mock("../../components/day-tasks/goals/goals", () => ({
  Goals: () => null,
}));

const baseTaskConfig: DayTaskConfig = {
  category: TASK_CATEGORY.SUMMARY,
  grade: 1,
  context: "morning",
  taskOutputType: TaskOutputType.Text,
  text: "Task description text",
  title: "My Task Title",
};

describe("TaskItem", () => {
  beforeEach(() => {
    mockGetUserDataQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: jest.fn(),
    });
  });

  it("renders the day task accordion title", () => {
    renderWithProviders(
      <TaskItem taskConfig={baseTaskConfig} currentDay="2025-12-01" />
    );
    expect(screen.getByText("Завдання дня")).toBeTruthy();
  });

  it("renders mood title for mood category tasks", () => {
    renderWithProviders(
      <TaskItem
        taskConfig={{
          ...baseTaskConfig,
          category: TASK_CATEGORY.MOOD,
          taskOutputType: TaskOutputType.TextPhoto,
        }}
        currentDay="2025-12-01"
      />
    );
    expect(screen.getByText("Завдання для настрою")).toBeTruthy();
  });
});
