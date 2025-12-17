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
import { GoalsData, TextData } from "../../../../types/types";
import { resolveErrorMessage } from "../../../../utils/utils";
import { useUnsavedChangesBlocker } from "../../../../hooks/useUnsavedChangesBlocker";

interface UseGoalsProps {
  context: string;
  data: GoalsData | null;
}

export const useGoals = ({ context, data }: UseGoalsProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveTaskByCategory] = useSaveTaskByCategoryMutation();
  const [removeTask] = useRemoveTaskMutation();
  const { selectedYear } = useAppSelector((state) => state.app);
  const currentGoal = data?.[context as keyof GoalsData] as TextData | null;
  useEffect(() => {
    if (isEmpty(currentGoal)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    if (currentGoal?.text) {
      setText(currentGoal.text);
    } else {
      setText("");
    }
  }, [currentGoal]);

  const handleSubmit = useCallback(
    async (submittedText: string) => {
      if (!submittedText.trim()) {
        Alert.alert(t("common.error"), t("errors.emptyText"));
        return;
      }

      const id = currentGoal?.id ?? uuid.v4().toString();

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
        const message =
          resolveErrorMessage(error) ??
          t("errors.generic", "An error occurred");

        Alert.alert(t("common.error"), message);
        console.error("Failed to save goal:", error);
      }
    },
    [saveTaskByCategory, context, currentGoal?.id, t, selectedYear]
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
            const message =
              resolveErrorMessage(error) ??
              t("errors.generic", "An error occurred");

            Alert.alert(t("common.error"), message);
          }
        },
      },
    ]);
  }, [removeTask, context, t, selectedYear]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (currentGoal?.text) {
      setText(currentGoal.text);
    } else {
      setText("");
    }

    if (!currentGoal?.text) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [currentGoal]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const unsavedChanges = Boolean(isEditing && text.trim());

  useUnsavedChangesBlocker(unsavedChanges);

  return {
    isEditing,
    text,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleCancel,
    handleTextChange,
  };
};
