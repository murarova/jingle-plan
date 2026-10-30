import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { TasksList } from "../../components/tasks/tasks-list";
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

const dayTask: DayTaskConfig = {
  category: TASK_CATEGORY.SUMMARY,
  grade: 1,
  context: "health",
  taskOutputType: TaskOutputType.Text,
  text: "Day task description",
  title: "Health plans",
};

const moodTask: DayTaskConfig = {
  category: TASK_CATEGORY.MOOD,
  grade: 1,
  context: "health",
  taskOutputType: TaskOutputType.TextPhoto,
  text: "Mood task description",
  title: "Mood note",
};

describe("TasksList", () => {
  it("opens the day task card and switches to the mood task", () => {
    renderWithProviders(
      <TasksList
        videoText=""
        videoId=""
        dayTaskConfig={dayTask}
        moodTaskConfig={moodTask}
        currentDay="2025-12-01"
        userData={null}
      />
    );

    expect(screen.getByText("Health plans")).toBeTruthy();
    expect(screen.queryByText("Mood note")).toBeNull();

    fireEvent.press(screen.getByRole("tab", { name: "Завдання для настрою" }));

    expect(screen.getByText("Mood note")).toBeTruthy();
    expect(screen.queryByText("Health plans")).toBeNull();
  });
});