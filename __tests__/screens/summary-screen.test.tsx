import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { SummaryScreen } from "../../screens/summary-screen";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import {
  mockGetUserDataQuery,
  mockSaveTaskByCategoryMutation,
  mockRemoveTaskMutation,
  saveTaskByCategoryTrigger,
  removeTaskTrigger,
  resetApiHookMocks,
} from "../mocks/api-hooks";
import { TASK_CATEGORY } from "../../constants/constants";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useRemoveTaskMutation: () => mockRemoveTaskMutation(),
}));

jest.mock("../../hooks/useUnsavedChangesBlocker", () => ({
  useUnsavedChangesBlocker: jest.fn(),
}));

const TEXTAREA_PLACEHOLDER = "Напишить щось тут";

const setUserData = (data: unknown) => {
  mockGetUserDataQuery.mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: jest.fn(),
  });
};

describe("SummaryScreen", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("shows the empty screen when there is no summary data", () => {
    setUserData(null);
    renderWithProviders(<SummaryScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  describe("with summary data", () => {
    beforeEach(() => {
      setUserData({
        summary: {
          health: { id: "s1", text: "Health reflection", rate: 75 },
          work: { id: "s2", text: "Work reflection", rate: 50 },
        },
      });
    });

    it("renders accordion headers for contexts with data", () => {
      renderWithProviders(<SummaryScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("Тіло")).toBeTruthy();
      expect(screen.getByText("Сродна праця")).toBeTruthy();
    });

    it("shows summary text after expanding a section", () => {
      renderWithProviders(<SummaryScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Тіло"));
      expect(screen.getByText("Health reflection")).toBeTruthy();
      expect(screen.getAllByText("Редагувати").length).toBeGreaterThan(0);
    });

    it("enters edit mode, saves updated text, and calls the mutation", async () => {
      renderWithProviders(<SummaryScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Тіло"));
      fireEvent.press(screen.getAllByText("Редагувати")[0]);
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Updated health reflection"
      );
      fireEvent.press(screen.getByText("Готово"));

      await waitFor(() => {
        expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TASK_CATEGORY.SUMMARY,
            context: "health",
            year: "2025",
            data: expect.objectContaining({
              text: "Updated health reflection",
              rate: 75,
            }),
          })
        );
      });
    });

    it("removes a summary after delete confirmation", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      renderWithProviders(<SummaryScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Тіло"));
      fireEvent.press(screen.getAllByText("Видалити")[0]);

      await waitFor(() => {
        expect(removeTaskTrigger).toHaveBeenCalledWith({
          category: TASK_CATEGORY.SUMMARY,
          context: "health",
          year: "2025",
        });
      });
    });
  });
});
