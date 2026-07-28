import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { MoodTask } from "../../../components/day-tasks/mood/mood-task";
import { renderWithProviders } from "../../utils/render";
import { loggedInPreloadedState } from "../../utils/day-task-helpers";
import {
  mockSaveMoodTaskMutation,
  mockRemoveTaskMutation,
  mockDeleteImageMutation,
  saveMoodTaskTrigger,
  removeTaskTrigger,
  resetApiHookMocks,
} from "../../mocks/api-hooks";
import { TASK_CATEGORY, TaskOutputType } from "@/constants";
import type { MoodTaskData } from "@/types";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  useSaveMoodTaskMutation: () => mockSaveMoodTaskMutation(),
  useRemoveTaskMutation: () => mockRemoveTaskMutation(),
  useDeleteImageMutation: () => mockDeleteImageMutation(),
  useSaveImageMutation: () => [
    jest.fn(() => ({ unwrap: () => Promise.resolve(null) })),
    { isLoading: false },
  ],
  useLazyGetImageUrlQuery: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve("https://example.com/image.jpg"),
    })),
    { isLoading: false },
  ],
}));

jest.mock("../../../hooks/useUnsavedChangesBlocker", () => ({
  useUnsavedChangesBlocker: jest.fn(),
}));

jest.mock("../../../hooks/useImage", () => ({
  useImage: () => require("../../utils/day-task-helpers").mockUseImage(),
}));

const DAY = "01";
const TEXTAREA_PLACEHOLDER = "Напишить щось тут";

describe("MoodTask", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    require("../../utils/day-task-helpers").resetImageMock();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("empty state", () => {
    it("opens the form when there is no mood data for the day", () => {
      renderWithProviders(
        <MoodTask data={null} day={DAY} taskOutputType={TaskOutputType.Text} />,
        { preloadedState: loggedInPreloadedState }
      );
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("blocks submit and alerts when text is empty", () => {
      renderWithProviders(
        <MoodTask data={null} day={DAY} taskOutputType={TaskOutputType.Text} />,
        { preloadedState: loggedInPreloadedState }
      );
      fireEvent.press(screen.getByText("Готово"));
      expect(alertSpy).toHaveBeenCalledWith(
        "Помилка",
        "Текстове поле не може бути порожнім"
      );
      expect(saveMoodTaskTrigger).not.toHaveBeenCalled();
    });

    it("saves mood text and exits edit mode", async () => {
      renderWithProviders(
        <MoodTask data={null} day={DAY} taskOutputType={TaskOutputType.Text} />,
        { preloadedState: loggedInPreloadedState }
      );
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Feeling calm"
      );
      fireEvent.press(screen.getByText("Готово"));

      await waitFor(() => {
        expect(saveMoodTaskTrigger).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TASK_CATEGORY.MOOD,
            day: DAY,
            year: "2025",
            data: expect.objectContaining({ text: "Feeling calm" }),
          })
        );
      });
      expect(screen.getByText("Feeling calm")).toBeTruthy();
    });
  });

  describe("saved state", () => {
    const savedData: MoodTaskData = {
      [DAY]: {
        id: "mood-1",
        text: "Saved mood note",
        image: null,
      },
    };

    it("shows saved mood text and action buttons", () => {
      renderWithProviders(
        <MoodTask
          data={savedData}
          day={DAY}
          taskOutputType={TaskOutputType.Text}
        />,
        { preloadedState: loggedInPreloadedState }
      );
      expect(screen.getByText("Saved mood note")).toBeTruthy();
      expect(screen.getByText("Редагувати")).toBeTruthy();
    });

    it("switches to edit mode when edit is pressed", () => {
      renderWithProviders(
        <MoodTask
          data={savedData}
          day={DAY}
          taskOutputType={TaskOutputType.Text}
        />,
        { preloadedState: loggedInPreloadedState }
      );
      fireEvent.press(screen.getByText("Редагувати"));
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("removes the mood task after delete confirmation", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      renderWithProviders(
        <MoodTask
          data={savedData}
          day={DAY}
          taskOutputType={TaskOutputType.Text}
        />,
        { preloadedState: loggedInPreloadedState }
      );
      fireEvent.press(screen.getByText("Видалити"));

      await waitFor(() => {
        expect(removeTaskTrigger).toHaveBeenCalledWith({
          category: TASK_CATEGORY.MOOD,
          context: "",
          day: DAY,
          year: "2025",
        });
      });
    });
  });
});
