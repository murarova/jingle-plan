import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { TASK_CATEGORY } from "../../../constants/constants";
import {
  TaskContext,
  SummaryData,
  SummaryContextData,
} from "../../../types/types";
import { useAppSelector } from "../../../store/withTypes";
import {
  useRemoveTaskMutation,
  useSaveTaskByCategoryMutation,
} from "../../../services/api";
import { useTranslation } from "react-i18next";

interface UseSummaryScreenProps {
  summary: SummaryContextData | null;
}

export const useSummaryScreen = ({ summary }: UseSummaryScreenProps) => {
  const { t } = useTranslation();
  const [saveTaskByCategory] = useSaveTaskByCategoryMutation();
  const [removeTask] = useRemoveTaskMutation();
  const { selectedYear } = useAppSelector((state) => state.app);

  const [editContext, setEditContext] = useState<TaskContext | null>(null);
  const [text, setText] = useState("");

  const handleTaskSubmit = useCallback(
    async (context: TaskContext, item?: SummaryData) => {
      if (!text.trim()) {
        Alert.alert(t("common.error"), t("errors.emptyText"));
        return;
      }

      try {
        await saveTaskByCategory({
          category: TASK_CATEGORY.SUMMARY,
          data: {
            ...item,
            text,
            rate: item?.rate ?? 0,
          },
          context,
          year: selectedYear,
        }).unwrap();
        setEditContext(null);
        setText("");

        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          console.log("Haptics not available");
        }
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
      }
    },
    [saveTaskByCategory, text, t, selectedYear]
  );

  const handleTaskRemove = useCallback(
    async (context: TaskContext) => {
      Alert.alert(t("common.delete"), t("messages.confirmDeleteTask"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await removeTask({
                category: TASK_CATEGORY.SUMMARY,
                context,
                year: selectedYear,
              }).unwrap();
              setText("");
            } catch (error) {
              Alert.alert(t("common.error"), t("errors.generic"));
            }
          },
        },
      ]);
    },
    [removeTask, t, selectedYear]
  );

  const handleCancel = useCallback(
    (context: TaskContext) => {
      // Reset form to original state
      if (summary?.[context]?.text) {
        setText(summary[context]!.text);
      } else {
        setText("");
      }
      setEditContext(null);
    },
    [summary]
  );

  const handleEdit = useCallback(
    (context: TaskContext) => {
      setEditContext(context);
      setText(summary?.[context]?.text || "");
    },
    [summary]
  );

  return {
    editContext,
    text,
    setText,
    handleTaskSubmit,
    handleTaskRemove,
    handleCancel,
    handleEdit,
  };
};
