import { useState, useCallback } from "react";
import { TASK_CATEGORY } from "../../../constants/constants";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
  TaskGategory,
} from "../../../types/types";
import { useAppDispatch } from "../../../store/withTypes";
import {
  removeTaskAsync,
  saveTaskByCategoryAsync,
} from "../../../services/data-api";
import { useTranslation } from "react-i18next";

interface UsePlansScreenProps {
  plans: PlansCollection | null;
}
export const usePlansScreen = ({ plans }: UsePlansScreenProps) => {
  const [updatedData, setUpdatedData] = useState<PlanScreenData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [context, setContext] = useState<TaskContext | null>(null);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const updatePlan = useCallback(
    async (updatedPlans: PlanScreenData[]) => {
      if (!context) {
        return;
      }

      try {
        await dispatch(
          saveTaskByCategoryAsync({
            category: TASK_CATEGORY.PLANS as TaskGategory,
            data: updatedPlans,
            context,
          })
        ).unwrap();
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
      } finally {
        setUpdatedData(null);
        setContext(null);
      }
    },
    [context, dispatch, t]
  );

  const handleUpdatePlan = useCallback(
    (id: string, text: string) => {
      if (!context || !plans) {
        return;
      }

      const plansList = plans[context];
      if (!plansList) {
        return;
      }

      const updatedPlans = plansList.map((item) =>
        item.id === id ? { ...item, text } : item
      );
      updatePlan(updatedPlans);
    },
    [context, plans, updatePlan]
  );

  const handleEditPlan = useCallback(
    (item: PlanScreenData, planContext: TaskContext) => {
      if (!plans) {
        return;
      }

      const plansList = plans[planContext];
      if (!plansList) {
        return;
      }

      const plan = plansList.find((p) => p.id === item.id) ?? null;
      setContext(planContext);
      setUpdatedData(plan);
      setShowModal(true);
    },
    [plans]
  );

  const handleDeletePlan = useCallback(
    async (id: string, planContext: TaskContext) => {
      if (!plans) {
        return;
      }

      const plansList = plans[planContext];
      if (!plansList) {
        return;
      }

      const updatedPlans = plansList.filter((item) => item.id !== id);

      try {
        if (!isEmpty(updatedPlans)) {
          await dispatch(
            saveTaskByCategoryAsync({
              category: TASK_CATEGORY.PLANS as TaskGategory,
              data: updatedPlans,
              context: planContext,
            })
          ).unwrap();
        } else {
          await dispatch(
            removeTaskAsync({
              category: TASK_CATEGORY.PLANS as TaskGategory,
              context: planContext,
            })
          ).unwrap();
        }
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
      }
    },
    [dispatch, plans, t]
  );

  const handleCompletePlan = useCallback(
    async (plan: PlanScreenData, isDone: boolean, planContext: TaskContext) => {
      if (!plans) {
        return;
      }

      const plansList = plans[planContext];
      if (!plansList) {
        return;
      }

      const updatedPlans = plansList.map((item) =>
        item.id === plan.id ? { ...plan, isDone } : item
      );

      try {
        await dispatch(
          saveTaskByCategoryAsync({
            category: TASK_CATEGORY.PLANS as TaskGategory,
            data: updatedPlans,
            context: planContext,
          })
        ).unwrap();
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
      } finally {
        setUpdatedData(null);
        setContext(null);
      }
    },
    [dispatch, plans, t]
  );

  const openMonthSelect = useCallback(
    (plan: PlanScreenData, planContext: TaskContext) => {
      setUpdatedData(plan);
      setContext(planContext);
      setShowMonthModal(true);
    },
    []
  );

  const handleMonthSelect = useCallback(
    (month: string) => {
      if (!plans || !context) {
        return;
      }

      const plansList = plans[context];
      if (!plansList || !updatedData) {
        return;
      }

      const updatedPlans = plansList.map((item) =>
        item.id === updatedData.id ? { ...updatedData, month } : item
      );
      updatePlan(updatedPlans);
      setShowMonthModal(false);
    },
    [context, plans, updatedData, updatePlan]
  );

  return {
    handleUpdatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleCompletePlan,
    openMonthSelect,
    handleMonthSelect,
    showModal,
    showMonthModal,
    context,
    updatedData,
    setShowModal,
    setShowMonthModal,
  };
};

export type UsePlansScreenReturn = ReturnType<typeof usePlansScreen>;
