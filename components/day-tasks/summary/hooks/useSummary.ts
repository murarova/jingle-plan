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
import { SummaryContextData } from "../../../../types/types";

interface UseSummaryProps {
  context: string;
  data: SummaryContextData | null;
}

export const useSummary = ({ context, data }: UseSummaryProps) => {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const [saveTaskByCategory] = useSaveTaskByCategoryMutation();
  const [removeTask] = useRemoveTaskMutation();
  const { selectedYear } = useAppSelector((state) => state.app);

  const [text, setText] = useState("");
  const [rate, setRate] = useState(50);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEmpty(contextData)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    if (contextData?.text) {
      setText(contextData.text);
    }

    if (contextData?.rate) {
      setRate(contextData.rate);
    }
  }, [contextData]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleRateChange = useCallback((newRate: number) => {
    setRate(newRate);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    // Reset form to original state
    if (contextData?.text) {
      setText(contextData.text);
    } else {
      setText("");
    }

    if (contextData?.rate) {
      setRate(contextData.rate);
    } else {
      setRate(50);
    }

    setIsEditing(false);
  }, [contextData]);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      Alert.alert(t("common.error"), t("errors.emptyText"));
      return;
    }

    const id = contextData?.id ?? uuid.v4().toString();

    const updatedSummary = {
      id,
      text,
      rate,
    };

    try {
      await saveTaskByCategory({
        category: TASK_CATEGORY.SUMMARY,
        data: updatedSummary,
        context,
        year: selectedYear,
      }).unwrap();
      setIsEditing(false);

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [text, rate, contextData, saveTaskByCategory, context, t, selectedYear]);

  const handleTaskRemove = useCallback(async () => {
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
            setRate(50);
          } catch (error) {
            Alert.alert(t("common.error"), t("errors.generic"));
          }
        },
      },
    ]);
  }, [removeTask, context, t, selectedYear]);

  return {
    isEditing,
    text,
    rate,
    handleTextChange,
    handleRateChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleTaskRemove,
  };
};
