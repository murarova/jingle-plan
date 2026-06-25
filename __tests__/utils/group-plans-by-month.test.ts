import {
  groupPlansByMonth,
} from "../../components/plans-view/month-view/helpers";
import type { PlansCollection } from "../../types/types";

describe("groupPlansByMonth", () => {
  it("returns an empty object for empty plans", () => {
    expect(groupPlansByMonth({})).toEqual({});
  });

  it("groups plans by their month", () => {
    const plans: PlansCollection = {
      health: [
        { id: "h1", text: "Run", isDone: false, month: "january", context: "health" },
        { id: "h2", text: "Swim", isDone: false, month: "march", context: "health" },
      ],
    };

    const result = groupPlansByMonth(plans);
    expect(result.january).toHaveLength(1);
    expect(result.january?.[0].text).toBe("Run");
    expect(result.march).toHaveLength(1);
  });

  it("expands every-month plans into each monthly bucket", () => {
    const plans: PlansCollection = {
      work: [
        {
          id: "w1",
          text: "Daily standup",
          isDone: false,
          month: "every",
          context: "work",
          monthlyProgress: [
            { month: "january", isDone: false },
            { month: "february", isDone: true },
          ],
        },
      ],
    };

    const result = groupPlansByMonth(plans);
    expect(result.january).toHaveLength(1);
    expect(result.february).toHaveLength(1);
    expect(result.january?.[0].context).toBe("work");
  });
});
