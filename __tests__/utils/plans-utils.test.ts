import { findPlanContextById, getPlansList } from "../../utils/plans-utils";
import type { PlanScreenData, PlansCollection } from "@/types";

const makePlan = (id: string, context: string): PlanScreenData =>
  ({
    id,
    context,
    text: `plan-${id}`,
    isDone: false,
  }) as unknown as PlanScreenData;

const plans: PlansCollection = {
  health: [makePlan("h1", "health"), makePlan("h2", "health")],
  work: [makePlan("w1", "work")],
};

describe("findPlanContextById", () => {
  it("finds the context that owns a plan id", () => {
    expect(findPlanContextById(plans, "h2")).toBe("health");
    expect(findPlanContextById(plans, "w1")).toBe("work");
  });

  it("returns null when no plan matches", () => {
    expect(findPlanContextById(plans, "missing")).toBeNull();
  });
});

describe("getPlansList", () => {
  it("returns the list for a context", () => {
    expect(getPlansList(plans, "health")).toHaveLength(2);
  });

  it("returns an empty array for an empty context", () => {
    expect(getPlansList(plans, "relax")).toEqual([]);
  });

  it("returns an empty array when plans is null", () => {
    expect(getPlansList(null, "health")).toEqual([]);
  });
});
