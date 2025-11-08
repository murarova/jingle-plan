import { PlansCollection, TaskContext } from "../../../types/types";
import { PlanWithContext, PlansMonthData } from "./types";

export const groupPlansByMonth = (plans: PlansCollection): PlansMonthData => {
  const result: PlansMonthData = {};

  Object.entries(plans).forEach(([context, contextPlans]) => {
    contextPlans?.forEach((item) => {
      const itemWithContext: PlanWithContext = {
        ...item,
        context: context as TaskContext,
      };

      if (item.month === "every") {
        item.monthlyProgress?.forEach((month) => {
          result[month.month] = result[month.month] || [];
          result[month.month].push(itemWithContext);
        });
      } else if (item.month) {
        result[item.month] = result[item.month] || [];
        result[item.month].push(itemWithContext);
      }
    });
  });

  return result;
};

