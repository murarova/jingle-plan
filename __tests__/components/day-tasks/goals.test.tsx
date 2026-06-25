import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { Goals } from "../../../components/day-tasks/goals/goals";
import { renderWithProviders } from "../../utils/render";
import { loggedInPreloadedState } from "../../utils/day-task-helpers";
import {
  mockSaveTaskByCategoryMutation,
  mockRemoveTaskMutation,
  saveTaskByCategoryTrigger,
  removeTaskTrigger,
  resetApiHookMocks,
} from "../../mocks/api-hooks";
import { TASK_CATEGORY } from "../../../constants/constants";
import type { GoalsData } from "../../../types/types";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useRemoveTaskMutation: () => mockRemoveTaskMutation(),
}));

jest.mock("../../../hooks/useUnsavedChangesBlocker", () => ({
  useUnsavedChangesBlocker: jest.fn(),
}));

const CONTEXT = "globalGoal";
const TEXTAREA_PLACEHOLDER = "Напишить щось тут";

describe("Goals", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("empty state", () => {
    it("opens the form when there is no saved goal", () => {
      renderWithProviders(<Goals context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("blocks submit and alerts when text is empty", () => {
      renderWithProviders(<Goals context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByLabelText("Save goals"));
      expect(alertSpy).toHaveBeenCalledWith(
        "Помилка",
        "Текстове поле не може бути порожнім"
      );
      expect(saveTaskByCategoryTrigger).not.toHaveBeenCalled();
    });

    it("saves the goal and exits edit mode", async () => {
      renderWithProviders(<Goals context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Run a marathon"
      );
      fireEvent.press(screen.getByLabelText("Save goals"));

      await waitFor(() => {
        expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TASK_CATEGORY.GOALS,
            context: CONTEXT,
            year: "2025",
            data: expect.objectContaining({ text: "Run a marathon" }),
          })
        );
      });
      expect(screen.getByText("Run a marathon")).toBeTruthy();
    });
  });

  describe("saved state", () => {
    const savedData: GoalsData = {
      globalGoal: { id: "goal-1", text: "My global goal" },
    };

    it("shows saved goal text and action buttons", () => {
      renderWithProviders(<Goals context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("My global goal")).toBeTruthy();
      expect(screen.getByText("Редагувати")).toBeTruthy();
    });

    it("switches to edit mode when edit is pressed", () => {
      renderWithProviders(<Goals context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Редагувати"));
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("removes the goal after delete confirmation", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      renderWithProviders(<Goals context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Видалити"));

      await waitFor(() => {
        expect(removeTaskTrigger).toHaveBeenCalledWith({
          category: TASK_CATEGORY.GOALS,
          context: CONTEXT,
          year: "2025",
        });
      });
    });
  });
});
