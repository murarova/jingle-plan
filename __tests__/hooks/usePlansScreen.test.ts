import { Alert } from "react-native";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { usePlansScreen } from "../../screens/plans-screen/hooks/usePlansScreen";
import { createHookWrapper } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import {
  mockSaveTaskByCategoryMutation,
  saveTaskByCategoryTrigger,
  resetApiHookMocks,
} from "../mocks/api-hooks";
import { PlansViewOptions, TASK_CATEGORY } from "../../constants/constants";
import type { PlanContextData, PlanScreenData } from "../../types/types";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useLazyGetUserDataQuery: () => [
    jest.fn(() => ({ unwrap: () => Promise.resolve(null) })),
    { isLoading: false },
  ],
}));

const plans: PlanContextData = {
  health: [{ id: "h1", text: "Morning run", isDone: false }],
  work: [
    {
      id: "w1",
      text: "Ship feature",
      isDone: true,
      month: "january",
    } as PlanScreenData,
  ],
};

describe("usePlansScreen", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("builds contextEntries for non-empty contexts only", () => {
    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    expect(result.current.contextEntries).toHaveLength(2);
    expect(result.current.contextEntries.map((entry) => entry.context)).toEqual([
      "health",
      "work",
    ]);
  });

  it("groups plans by month", () => {
    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    expect(result.current.monthlyPlans.january).toHaveLength(1);
    expect(result.current.monthlyPlans.january?.[0].text).toBe("Ship feature");
  });

  it("adds a plan through handleAddPlan", async () => {
    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    await act(async () => {
      await result.current.handleAddPlan("Evening stretch", "health");
    });

    expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        category: TASK_CATEGORY.PLANS,
        context: "health",
        year: "2025",
        data: expect.arrayContaining([
          expect.objectContaining({ text: "Evening stretch", isDone: false }),
        ]),
      })
    );
  });

  it("deletes a plan after confirmation", async () => {
    alertSpy.mockImplementation(
      (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
        buttons?.[1]?.onPress?.();
      }
    );

    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    await act(async () => {
      await result.current.handleDeletePlan("h1", "health");
    });

    await waitFor(() => {
      expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
        expect.objectContaining({
          category: TASK_CATEGORY.PLANS,
          context: "health",
          data: [],
        })
      );
    });
  });

  it("marks a plan as complete", async () => {
    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    await act(async () => {
      await result.current.handleCompletePlan({
        plan: plans.health![0] as PlanScreenData,
        value: true,
        context: "health",
        view: PlansViewOptions.context,
      });
    });

    expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        category: TASK_CATEGORY.PLANS,
        context: "health",
        data: [expect.objectContaining({ id: "h1", isDone: true })],
      })
    );
  });
});
