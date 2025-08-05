import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
  TaskGategory,
} from "../types/types";
import { TASK_CATEGORY } from "../constants/constants";
import { removeTaskAsync, saveTaskByCategoryAsync } from "../services/data-api";
import { AppDispatch } from "../store/store";
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

export const savePlans = async (
  dispatch: AppDispatch,
  context: TaskContext,
  data: PlanScreenData[],
  t: TFunction
): Promise<void> => {
  try {
    if (!isEmpty(data)) {
      await dispatch(
        saveTaskByCategoryAsync({
          category: TASK_CATEGORY.PLANS as TaskGategory,
          data,
          context,
        })
      ).unwrap();
    } else {
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.PLANS as TaskGategory,
          context,
        })
      ).unwrap();
    }
  } catch (error) {
    Alert.alert(t("common.error"), t("errors.generic"));
    throw error;
  }
};
