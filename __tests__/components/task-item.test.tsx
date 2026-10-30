import React from "react";
import { screen } from "@testing-library/react-native";
import { TaskItem } from "../../components/tasks/task-item";
import { renderWithProviders } from "../utils/render";
import { TASK_CATEGORY, TaskOutputType } from "@/constants";
import type { DayTaskConfig } from "@/types";

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
  context: "health",
  taskOutputType: TaskOutputType.Text,
  text: "Task description text",
  title: "My Task Title",
};

describe("TaskItem", () => {
  it("renders the task title and description", () => {
    renderWithProviders(
      <TaskItem
        taskConfig={baseTaskConfig}
        currentDay="2025-12-01"
        userData={null}
      />
    );
    expect(screen.getByText("My Task Title")).toBeTruthy();
    expect(screen.getByText("Task description text")).toBeTruthy();
  });

  it("renders the title and description for mood category tasks", () => {
    renderWithProviders(
      <TaskItem
        taskConfig={{
          ...baseTaskConfig,
          category: TASK_CATEGORY.MOOD,
          taskOutputType: TaskOutputType.TextPhoto,
        }}
        currentDay="2025-12-01"
        userData={null}
      />
    );
    expect(screen.getByText("My Task Title")).toBeTruthy();
    expect(screen.getByText("Task description text")).toBeTruthy();
  });
});
