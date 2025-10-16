import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";
import isEmpty from "lodash/isEmpty";
import { TASK_CATEGORY } from "../../../../constants/constants";
import {
  useRemoveTaskMutation,
  useSaveTaskByCategoryMutation,
} from "../../../../services/api";
import { useAppSelector } from "../../../../store/withTypes";
import { TextData } from "../../../../types/types";

interface UseGoalsProps {
  context: string;
  data: TextData | null;
}

export const useGoals = ({ context, data }: UseGoalsProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveTaskByCategory] = useSaveTaskByCategoryMutation();
  const [removeTask] = useRemoveTaskMutation();
  const { selectedYear } = useAppSelector((state) => state.app);

  useEffect(() => {
    setIsEditing(isEmpty(data));
    if (data?.text) {
      setText(data.text);
    }
  }, [data]);

  const handleSubmit = useCallback(
    async (submittedText: string) => {
      if (!submittedText.trim()) {
        Alert.alert(t("common.error"), t("errors.emptyText"));
        return;
      }

      const id = data?.id ?? uuid.v4().toString();

      const updatedGoal = {
        id,
        text: submittedText,
      };

      try {
        await saveTaskByCategory({
          category: TASK_CATEGORY.GOALS,
          data: updatedGoal,
          context,
          year: selectedYear,
        }).unwrap();

        setText(submittedText);
        setIsEditing(false);

        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          console.log("Haptics not available");
        }
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
        console.error("Failed to save goal:", error);
      }
    },
    [saveTaskByCategory, context, data?.id, t, selectedYear]
  );

  const handleRemove = useCallback(async () => {
    Alert.alert(t("common.delete"), t("messages.confirmDeleteTask"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await removeTask({
              category: TASK_CATEGORY.GOALS,
              context,
              year: selectedYear,
            }).unwrap();
            setText("");
            setIsEditing(true);
          } catch (error) {
            Alert.alert(t("common.error"), t("errors.generic"));
          }
        },
      },
    ]);
  }, [removeTask, context, t, selectedYear]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    // Reset form to original state
    if (data?.text) {
      setText(data.text);
    } else {
      setText("");
    }
    setIsEditing(false);
  }, [data]);

  return {
    isEditing,
    text,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleCancel,
  };
};
