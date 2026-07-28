import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { Summary } from "../../../components/day-tasks/summary/summary";
import { renderWithProviders } from "../../utils/render";
import { loggedInPreloadedState } from "../../utils/day-task-helpers";
import {
  mockSaveTaskByCategoryMutation,
  mockRemoveTaskMutation,
  saveTaskByCategoryTrigger,
  removeTaskTrigger,
  resetApiHookMocks,
} from "../../mocks/api-hooks";
import { TASK_CATEGORY } from "@/constants";
import type { SummaryContextData } from "@/types";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useRemoveTaskMutation: () => mockRemoveTaskMutation(),
}));

jest.mock("../../../hooks/useUnsavedChangesBlocker", () => ({
  useUnsavedChangesBlocker: jest.fn(),
}));

const CONTEXT = "health";
const TEXTAREA_PLACEHOLDER = "Напишить щось тут";

describe("Summary", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("empty state", () => {
    it("opens the form when there is no saved data", () => {
      renderWithProviders(<Summary context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByText("Готово")).toBeTruthy();
    });

    it("blocks submit and alerts when text is empty", () => {
      renderWithProviders(<Summary context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Готово"));
      expect(alertSpy).toHaveBeenCalledWith(
        "Помилка",
        "Текстове поле не може бути порожнім"
      );
      expect(saveTaskByCategoryTrigger).not.toHaveBeenCalled();
    });

    it("saves the summary and exits edit mode", async () => {
      renderWithProviders(<Summary context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Feeling great today"
      );
      fireEvent.press(screen.getByText("Готово"));

      await waitFor(() => {
        expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TASK_CATEGORY.SUMMARY,
            context: CONTEXT,
            year: "2025",
            data: expect.objectContaining({
              text: "Feeling great today",
              rate: 50,
            }),
          })
        );
      });
      expect(screen.queryByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeNull();
      expect(screen.getByText("Feeling great today")).toBeTruthy();
    });
  });

  describe("saved state", () => {
    const savedData: SummaryContextData = {
      [CONTEXT]: {
        id: "summary-1",
        text: "Saved summary text",
        rate: 75,
      },
    };

    it("shows saved text and action buttons", () => {
      renderWithProviders(<Summary context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("Saved summary text")).toBeTruthy();
      expect(screen.getByText("Редагувати")).toBeTruthy();
      expect(screen.getByText("Видалити")).toBeTruthy();
    });

    it("switches to edit mode when edit is pressed", () => {
      renderWithProviders(<Summary context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Редагувати"));
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("cancels editing and restores the saved text", () => {
      renderWithProviders(<Summary context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Редагувати"));
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Changed text"
      );
      fireEvent.press(screen.getByText("Відмінити"));
      expect(screen.getByText("Saved summary text")).toBeTruthy();
      expect(screen.queryByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeNull();
    });

    it("removes the task after delete confirmation", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      renderWithProviders(<Summary context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Видалити"));

      await waitFor(() => {
        expect(removeTaskTrigger).toHaveBeenCalledWith({
          category: TASK_CATEGORY.SUMMARY,
          context: CONTEXT,
          year: "2025",
        });
      });
    });
  });
});
