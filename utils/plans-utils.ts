import { PlanScreenData, PlansCollection, TaskContext } from "../types/types";

export const findPlanContextById = (
  plans: PlansCollection,
  id: string
): TaskContext | null => {
  for (const [context, plansList] of Object.entries(plans)) {
    if (plansList?.find((item) => item.id === id)) {
      return context as TaskContext;
    }
  }
  return null;
};

export const getPlansList = (
  plans: PlansCollection | null,
  context: TaskContext
): PlanScreenData[] => {
  return plans?.[context] || [];
};
