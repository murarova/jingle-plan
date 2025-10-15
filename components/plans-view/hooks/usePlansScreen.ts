import { useState, useCallback, useRef } from "react";
import {
  PlanScreenData,
  PlansCollection,
  TaskContext,
} from "../../../types/types";
import { useAppDispatch } from "../../../store/withTypes";
import { useTranslation } from "react-i18next";
import {
  findPlanContextById,
  getPlansList,
  savePlans,
} from "../../../utils/plans-utils";
import { SheetRef } from "../../common";
import { CompletePlanProps } from "../plans-context-view";
import { allMonths, PlansViewOptions } from "../../../constants/constants";
import { Alert } from "react-native";

interface UsePlansScreenProps {
  plans: PlansCollection | null;
}

export const usePlansScreen = ({ plans }: UsePlansScreenProps) => {
  const [updatedData, setUpdatedData] = useState<PlanScreenData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [context, setContext] = useState<TaskContext | null>(null);
  const sheetRef = useRef<SheetRef>(null);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const resetState = useCallback(() => {
    setUpdatedData(null);
    setContext(null);
    setSelectedMonth(undefined);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetState();
  }, [resetState]);

  const closeMonthModal = useCallback(() => {
    sheetRef.current?.hide();
    resetState();
  }, [resetState]);

  const updatePlan = useCallback(
    async (context: TaskContext, updatedPlans: PlanScreenData[]) => {
      try {
        await savePlans(dispatch, context, updatedPlans, t);
      } finally {
        resetState();
      }
    },
    [dispatch, t, resetState]
  );

  const handleUpdatePlan = useCallback(
    async (id: string, text: string) => {
      if (!context || !plans || !updatedData) return;

      const oldContext = findPlanContextById(plans, id);
      const isContextChanged = oldContext && oldContext !== context;

      try {
        if (isContextChanged) {
          const oldPlansList = getPlansList(plans, oldContext);
          const updatedOldPlans = oldPlansList.filter((item) => item.id !== id);
          await savePlans(dispatch, oldContext, updatedOldPlans, t);

          const newPlansList = getPlansList(plans, context);
          const updatedNewPlans = [
            ...newPlansList,
            { ...updatedData, text, context, month: selectedMonth },
          ];
          await savePlans(dispatch, context, updatedNewPlans, t);
        } else {
          const plansList = getPlansList(plans, context);
          const updatedPlans =
            plansList.length > 0
              ? plansList.map((item) =>
                  item.id === updatedData.id
                    ? { ...updatedData, text, context, month: selectedMonth }
                    : item
                )
              : [{ ...updatedData, text, context, month: selectedMonth }];

          await savePlans(dispatch, context, updatedPlans, t);
        }
      } catch (error) {}
    },
    [plans, context, updatedData, selectedMonth, dispatch, t]
  );

  const handleEditPlan = useCallback(
    (item: PlanScreenData, planContext: TaskContext) => {
      const plansList = getPlansList(plans, planContext);
      const plan = plansList.find((p) => p.id === item.id) ?? null;

      setContext(planContext);
      setSelectedMonth(plan?.month);
      setUpdatedData(plan);
      setShowModal(true);
    },
    [plans]
  );

  const handleDeletePlan = useCallback(
    async (id: string, planContext: TaskContext) => {
      if (!plans) return;

      Alert.alert(t("common.delete"), t("messages.confirmDeletePlan"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            const plansList = getPlansList(plans, planContext);
            const updatedPlans = plansList.filter((item) => item.id !== id);
            await savePlans(dispatch, planContext, updatedPlans, t);
          },
        },
      ]);
    },
    [plans, dispatch, t]
  );

  const handleCompletePlan = useCallback(
    async (props: CompletePlanProps) => {
      const { plan, value: isDone, context: planContext, month, view } = props;
      if (!plans) return;

      const plansList = getPlansList(plans, planContext);
      if (!plansList) return;

      let updatedPlan = {
        ...plan,
        monthlyProgress: plan.monthlyProgress ? [...plan.monthlyProgress] : [],
      };

      if (plan.month === "every") {
        if (view === PlansViewOptions.context) {
          updatedPlan.monthlyProgress = updatedPlan.monthlyProgress.map(
            (planMonth) => ({ ...planMonth, isDone })
          );
        }
        if (plan.month === "every" && month) {
          updatedPlan.monthlyProgress = updatedPlan.monthlyProgress.map(
            (planMonth) =>
              planMonth.month === month ? { ...planMonth, isDone } : planMonth
          );
        }

        const isAllDone = updatedPlan.monthlyProgress.every(
          (planMonth) => planMonth.isDone
        );
        updatedPlan.isDone = isAllDone;
      } else {
        updatedPlan.isDone = isDone;
      }

      const updatedPlans = plansList.map((item) =>
        item.id === plan.id ? updatedPlan : item
      );

      try {
        await savePlans(dispatch, planContext, updatedPlans, t);
      } catch (error) {
        console.error("Failed to save plan completion:", error);
      } finally {
        resetState();
      }
    },
    [plans, dispatch, t, resetState]
  );

  const handleAddPlan = useCallback(
    async (text: string, context?: TaskContext, month?: string) => {
      if (!context) return;

      const id = Date.now().toString();
      const plansList = getPlansList(plans, context);
      const updatedPlans = [
        ...plansList,
        { id, text, isDone: false, month, context },
      ];

      await savePlans(dispatch, context, updatedPlans, t);
    },
    [plans, dispatch, t]
  );

  const openMonthSelect = useCallback(
    (plan: PlanScreenData, planContext: TaskContext) => {
      setUpdatedData(plan);
      setContext(planContext);
      setSelectedMonth(plan.month);
      sheetRef.current?.show();
    },
    []
  );

  const handleMonthSelect = useCallback(
    async (month: string) => {
      sheetRef.current?.hide();
      if (!plans || !context || !updatedData) return;
      const data = { ...updatedData };
      const plansList = getPlansList(plans, context);
      if (month === "every") {
        data.monthlyProgress = allMonths.map((month) => ({
          month,
          isDone: false,
        }));
      }
      const updatedPlans = plansList.map((item) =>
        item.id === data.id ? { ...data, month } : item
      );
      await updatePlan(context, updatedPlans);
    },
    [plans, context, updatedData, updatePlan]
  );

  return {
    handleUpdatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleCompletePlan,
    openMonthSelect,
    handleMonthSelect,
    showModal,
    context,
    updatedData,
    setShowModal,
    handleAddPlan,
    closeModal,
    closeMonthModal,
    setContext,
    selectedMonth,
    setSelectedMonth,
    sheetRef,
  };
};

export type UsePlansScreenReturn = ReturnType<typeof usePlansScreen>;
