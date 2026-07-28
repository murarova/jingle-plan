import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { MonthPhoto } from "../../../components/day-tasks/month-photo/month-photo";
import { renderWithProviders } from "../../utils/render";
import {
  loggedInPreloadedState,
  mockImage,
  resetImageMock,
  testImage,
} from "../../utils/day-task-helpers";
import {
  mockSaveTaskByCategoryMutation,
  mockRemoveTaskMutation,
  mockDeleteImageMutation,
  saveTaskByCategoryTrigger,
  removeTaskTrigger,
  resetApiHookMocks,
} from "../../mocks/api-hooks";
import { TASK_CATEGORY } from "@/constants";
import type { MonthPhotoData } from "@/types";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
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

const CONTEXT = "january";
const TEXTAREA_PLACEHOLDER = "Напишить щось тут";

describe("MonthPhoto", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    resetImageMock();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("empty state", () => {
    it("opens the form when there is no saved photo", () => {
      renderWithProviders(<MonthPhoto context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByText("Готово")).toBeTruthy();
    });

    it("blocks submit and alerts when no image is selected", () => {
      renderWithProviders(<MonthPhoto context={CONTEXT} data={null} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Готово"));
      expect(alertSpy).toHaveBeenCalledWith(
        "Помилка",
        "Будь ласка, оберіть зображення"
      );
      expect(saveTaskByCategoryTrigger).not.toHaveBeenCalled();
    });
  });

  describe("saved state", () => {
    const savedData: MonthPhotoData = {
      [CONTEXT]: {
        id: "photo-1",
        text: "Saved photo caption",
        image: testImage,
      },
    };

    beforeEach(() => {
      mockImage = testImage;
    });

    it("shows saved caption and action buttons", () => {
      renderWithProviders(<MonthPhoto context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByText("Saved photo caption")).toBeTruthy();
      expect(screen.getByText("Редагувати")).toBeTruthy();
    });

    it("switches to edit mode when edit is pressed", () => {
      renderWithProviders(<MonthPhoto context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Редагувати"));
      expect(screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER)).toBeTruthy();
    });

    it("saves an updated caption when editing", async () => {
      renderWithProviders(<MonthPhoto context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Редагувати"));
      fireEvent.changeText(
        screen.getByPlaceholderText(TEXTAREA_PLACEHOLDER),
        "Updated caption"
      );
      fireEvent.press(screen.getByText("Готово"));

      await waitFor(() => {
        expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
          expect.objectContaining({
            category: TASK_CATEGORY.MONTH_PHOTO,
            context: CONTEXT,
            year: "2025",
            data: expect.objectContaining({
              text: "Updated caption",
              image: testImage,
            }),
          })
        );
      });
    });

    it("removes the photo after delete confirmation", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      renderWithProviders(<MonthPhoto context={CONTEXT} data={savedData} />, {
        preloadedState: loggedInPreloadedState,
      });
      fireEvent.press(screen.getByText("Видалити"));

      await waitFor(() => {
        expect(removeTaskTrigger).toHaveBeenCalledWith({
          category: TASK_CATEGORY.MONTH_PHOTO,
          context: CONTEXT,
          year: "2025",
        });
      });
    });
  });
});
