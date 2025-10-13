import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
  TaskGategory,
} from "../types/types";
import { TASK_CATEGORY } from "../constants/constants";
// This utility will be updated to work with RTK Query mutations
// For now, components should use RTK Query hooks directly
import { TFunction } from "i18next";

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

// This function has been removed as components should use RTK Query hooks directly
// Use useSaveTaskByCategoryMutation and useRemoveTaskMutation in components
