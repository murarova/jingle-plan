import {
  calculateTotalData,
  calculateContextData,
  isDataEmpty,
} from "../../utils/dashboard-utils";
import type { PlanContextData, PlanData } from "@/types";

const plan = (overrides: Partial<PlanData>): PlanData =>
  ({
    id: Math.random().toString(),
    text: "task",
    isDone: false,
    ...overrides,
  }) as PlanData;

describe("calculateTotalData", () => {
  it("returns zeroed progress for empty data", () => {
    expect(calculateTotalData({})).toEqual({
      totalTasks: 0,
      doneTasks: 0,
      donePercentage: 0,
    });
  });

  it("counts plain tasks across contexts", () => {
    const data: PlanContextData = {
      health: [plan({ isDone: true }), plan({ isDone: false })],
      work: [plan({ isDone: true })],
    };
    expect(calculateTotalData(data)).toEqual({
      totalTasks: 3,
      doneTasks: 2,
      donePercentage: 67,
    });
  });

  it("expands 'every' month tasks to 12 and counts monthly progress", () => {
    const data: PlanContextData = {
      health: [
        plan({
          month: "every",
          monthlyProgress: [
            { month: "january", isDone: true },
            { month: "february", isDone: true },
            { month: "march", isDone: false },
          ],
        }),
      ],
    };
    const result = calculateTotalData(data);
    expect(result.totalTasks).toBe(13);
    expect(result.doneTasks).toBe(2);
    expect(result.donePercentage).toBe(15);
  });

  it("ignores null task lists", () => {
    const data = {
      health: null,
      work: [plan({ isDone: true })],
    } as unknown as PlanContextData;
    expect(calculateTotalData(data)).toEqual({
      totalTasks: 1,
      doneTasks: 1,
      donePercentage: 100,
    });
  });
});

describe("calculateContextData", () => {
  it("computes per-context progress", () => {
    const data: PlanContextData = {
      health: [plan({ isDone: true }), plan({ isDone: false })],
      work: [plan({ isDone: true })],
    };
    const result = calculateContextData(data);
    expect(result.health).toEqual({
      totalTasks: 2,
      doneTasks: 1,
      donePercentage: 50,
    });
    expect(result.work).toEqual({
      totalTasks: 1,
      doneTasks: 1,
      donePercentage: 100,
    });
  });

  it("accounts for 'every' month tasks per context", () => {
    const data: PlanContextData = {
      learning: [
        plan({
          month: "every",
          monthlyProgress: [
            { month: "january", isDone: true },
            { month: "february", isDone: true },
            { month: "march", isDone: true },
          ],
        }),
      ],
    };
    expect(calculateContextData(data).learning).toEqual({
      totalTasks: 13,
      doneTasks: 3,
      donePercentage: 23,
    });
  });
});

describe("isDataEmpty", () => {
  it("returns true for null", () => {
    expect(isDataEmpty(null)).toBe(true);
  });

  it("returns true when all values are zero", () => {
    expect(
      isDataEmpty({ totalTasks: 0, doneTasks: 0, donePercentage: 0 })
    ).toBe(true);
  });

  it("returns false when there is any progress", () => {
    expect(
      isDataEmpty({ totalTasks: 5, doneTasks: 0, donePercentage: 0 })
    ).toBe(false);
  });
});
