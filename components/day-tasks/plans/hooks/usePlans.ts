import { useCallback, useState } from "react";
import {
  MAX_PLANS_AMOUNT,
  TASK_CATEGORY,
} from "../../../../constants/constants";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { PlanData } from "../../../../types/types";
import { useAppSelector } from "../../../../store/withTypes";
import { useSaveTaskByCategoryMutation } from "../../../../services/api";

interface UsePlansProps {
  context: string;
  data: PlanData[] | null;
}

export function usePlans({ data, context }: UsePlansProps) {
  const { t } = useTranslation();
  const [saveTaskByCategory, { isLoading: isSaving }] =
    useSaveTaskByCategoryMutation();
  const { selectedYear } = useAppSelector((state) => state.app);
  const [updatedData, setUpdatedData] = useState<PlanData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setUpdatedData(null);
  }, []);

  async function handleAddPlan(text: string) {
    setLoading(true);
    const id = uuid.v4();
    const updatedPlans = [
      ...(data ?? []),
      {
        id,
        text,
        isDone: false,
      },
    ];
    try {
      await saveTaskByCategory({
        category: TASK_CATEGORY.PLANS,
        data: updatedPlans,
        context,
        year: selectedYear,
      }).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePlan(id: string, text: string) {
    setLoading(true);
    const updatedPlans = (data ?? []).map((item) =>
      item.id === id ? { ...item, text } : item
    );
    try {
      await saveTaskByCategory({
        category: TASK_CATEGORY.PLANS,
        data: updatedPlans,
        context,
        year: selectedYear,
      }).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setUpdatedData(null);
      setLoading(false);
    }
  }

  async function handleEditPlan(plan: PlanData) {
    setShowModal(true);
    setUpdatedData(plan);
  }

  async function handleDeletePlan(planItem: PlanData) {
    setLoading(true);
    const updatedPlans = (data ?? []).filter((item) => item.id !== planItem.id);
    if (isEmpty(updatedPlans)) {
    }

    try {
      await saveTaskByCategory({
        category: TASK_CATEGORY.PLANS,
        data: updatedPlans,
        context,
        year: selectedYear,
      }).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleAddPlanBtn() {
    if (data?.length === MAX_PLANS_AMOUNT) {
      Alert.alert(t("screens.plansScreen.maxPlansError"));
      return;
    }
    setShowModal(true);
  }

  return {
    updatedData,
    showModal,
    handleAddPlan,
    handleUpdatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleAddPlanBtn,
    isLoading: isLoading || isSaving,
    closeModal,
  };
}
