import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { Plans } from "../../../components/day-tasks/plans/plans";
import { renderWithProviders } from "../../utils/render";
import { loggedInPreloadedState } from "../../utils/day-task-helpers";
import {
  mockSaveTaskByCategoryMutation,
  saveTaskByCategoryTrigger,
  resetApiHookMocks,
} from "../../mocks/api-hooks";
import { MAX_PLANS_AMOUNT, TASK_CATEGORY } from "../../../constants/constants";
import type { PlanContextData } from "../../../types/types";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
}));

const CONTEXT = "health";
const MODAL_PLACEHOLDER = "Напишить щось тут";

const makePlan = (id: string, text: string) => ({ id, text, isDone: false });

describe("Plans", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("renders the add-plan button", () => {
    renderWithProviders(<Plans context={CONTEXT} data={null} />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Додати пункт плану")).toBeTruthy();
  });

  it("shows existing plans in the list", () => {
    const data: PlanContextData = {
      [CONTEXT]: [
        makePlan("p1", "Morning run"),
        makePlan("p2", "Read 30 minutes"),
      ],
    };
    renderWithProviders(<Plans context={CONTEXT} data={data} />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Morning run")).toBeTruthy();
    expect(screen.getByText("Read 30 minutes")).toBeTruthy();
  });

  it("opens the modal and saves a new plan", async () => {
    renderWithProviders(<Plans context={CONTEXT} data={null} />, {
      preloadedState: loggedInPreloadedState,
    });

    fireEvent.press(screen.getByText("Додати пункт плану"));
    expect(screen.getByText("Додайте один пункт плану")).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText(MODAL_PLACEHOLDER),
      "New plan item"
    );
    fireEvent.press(screen.getByText("Додати"));

    await waitFor(() => {
      expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
        expect.objectContaining({
          category: TASK_CATEGORY.PLANS,
          context: CONTEXT,
          year: "2025",
          data: expect.arrayContaining([
            expect.objectContaining({ text: "New plan item", isDone: false }),
          ]),
        })
      );
    });
  });

  it("blocks adding a plan when the maximum is reached", () => {
    const maxPlans = Array.from({ length: MAX_PLANS_AMOUNT }, (_, i) =>
      makePlan(`p${i}`, `Plan ${i}`)
    );
    const data: PlanContextData = { [CONTEXT]: maxPlans };

    renderWithProviders(<Plans context={CONTEXT} data={data} />, {
      preloadedState: loggedInPreloadedState,
    });

    fireEvent.press(screen.getByText("Додати пункт плану"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Ви не можете додати більше ніж 10 пунктів"
    );
    expect(screen.queryByText("Додайте один пункт плану")).toBeNull();
  });
});
