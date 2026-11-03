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
import { PlansViewOptions, TASK_CATEGORY } from "@/constants";
import type { PlanContextData, PlanScreenData } from "@/types";

const mockGetUserData = jest.fn(() => ({
  unwrap: (): Promise<unknown> => Promise.resolve(null),
}));

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useSaveTaskByCategoryMutation: () => mockSaveTaskByCategoryMutation(),
  useLazyGetUserDataQuery: () => [mockGetUserData, { isLoading: false }],
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
    mockGetUserData.mockClear();
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

  it("copies a plan to the next year unchecked and without a month after confirmation", async () => {
    alertSpy.mockImplementationOnce(
      (_title?: string, _msg?: string, buttons?: { onPress?: () => void }[]) => {
        buttons?.[1]?.onPress?.();
      }
    );
    const donePlan: PlanScreenData = {
      id: "e1",
      text: "Read a book",
      isDone: true,
      month: "every",
      context: "health",
      monthlyProgress: [
        { month: "january", isDone: true },
        { month: "february", isDone: true },
      ],
    };
    mockGetUserData.mockImplementationOnce(() => ({
      unwrap: () =>
        Promise.resolve({
          plans: { health: [{ id: "n1", text: "Swim", isDone: false }] },
        }),
    }));

    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    act(() => {
      result.current.handleCopyToNextYear?.(donePlan, "health");
    });

    await waitFor(() => {
      expect(saveTaskByCategoryTrigger).toHaveBeenCalledTimes(1);
    });
    expect(saveTaskByCategoryTrigger).toHaveBeenCalledWith({
      category: TASK_CATEGORY.PLANS,
      context: "health",
      year: "2026",
      data: [
        { id: "n1", text: "Swim", isDone: false },
        {
          id: expect.any(String),
          text: "Read a book",
          context: "health",
          isDone: false,
        },
      ],
    });
  });

  it("does not offer copying when the next year is not available", () => {
    const { result } = renderHook(() => usePlansScreen({ plans }), {
      wrapper: createHookWrapper({
        ...loggedInPreloadedState,
        app: { ...loggedInPreloadedState.app, selectedYear: "2026" },
      }),
    });

    expect(result.current.handleCopyToNextYear).toBeUndefined();
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
