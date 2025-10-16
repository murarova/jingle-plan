import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";
import isEmpty from "lodash/isEmpty";
import { TASK_CATEGORY, TaskOutputType } from "../../../../constants/constants";
import {
  useRemoveTaskMutation,
  useSaveMoodTaskMutation,
  useDeleteImageMutation,
} from "../../../../services/api";
import { useAppSelector } from "../../../../store/withTypes";
import { useImage } from "../../../../hooks/useImage";
import { MoodTaskData, TextImageData } from "../../../../types/types";

interface UseMoodTaskProps {
  data: MoodTaskData | null;
  day: string;
  taskOutputType: TaskOutputType;
}

export const useMoodTask = ({
  data,
  day,
  taskOutputType,
}: UseMoodTaskProps) => {
  const { t } = useTranslation();
  const [saveMoodTask] = useSaveMoodTaskMutation();
  const [removeTask] = useRemoveTaskMutation();
  const [deleteImage] = useDeleteImageMutation();
  const { selectedYear } = useAppSelector((state) => state.app);

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  const { saveImage, setImage, image, isLoading, setIsLoading } = useImage();
  const dayMoodData = data ? data[day] : null;

  useEffect(() => {
    if (isEmpty(dayMoodData)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    if (dayMoodData?.text) {
      setText(dayMoodData.text);
    }

    if (dayMoodData?.image) {
      setImage(dayMoodData?.image);
    }
  }, [dayMoodData, setImage]);

  const handleTaskRemove = useCallback(async () => {
    Alert.alert(t("common.delete"), t("messages.confirmDeleteTask"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await removeTask({
              category: TASK_CATEGORY.MOOD,
              context: "",
              day,
              year: selectedYear,
            }).unwrap();

            if (image) {
              await deleteImage({ image, year: selectedYear }).unwrap();
            }

            setText("");
            setImage(null);
          } catch (error) {
            Alert.alert(t("common.error"), t("errors.generic"));
          }
        },
      },
    ]);
  }, [removeTask, deleteImage, day, image, setImage, t, selectedYear]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    // Reset form to original state
    if (dayMoodData?.text) {
      setText(dayMoodData.text);
    } else {
      setText("");
    }

    if (dayMoodData?.image) {
      setImage(dayMoodData.image);
    } else {
      setImage(null);
    }

    setIsEditing(false);
  }, [dayMoodData, setImage]);

  const needsText =
    taskOutputType === TaskOutputType.Text ||
    taskOutputType === TaskOutputType.TextPhoto;
  const needsImage =
    taskOutputType === TaskOutputType.Image ||
    taskOutputType === TaskOutputType.TextPhoto;

  const isEditable = needsText || needsImage;

  const handleSubmit = useCallback(async () => {
    // Validation: Check if required fields are empty
    if (needsText && !text.trim()) {
      Alert.alert(t("common.error"), t("errors.emptyText"));
      return;
    }

    if (needsImage && !image) {
      Alert.alert(t("common.error"), t("errors.emptyImage"));
      return;
    }

    // Additional validation: if both text and image are required, at least one must be provided
    if (needsText && needsImage && !text.trim() && !image) {
      Alert.alert(t("common.error"), t("errors.emptyTextAndImage"));
      return;
    }

    const id = dayMoodData?.id ?? uuid.v4().toString();

    let updatedData: TextImageData = {
      id,
      text,
      image: image || null,
    };

    try {
      if (image) {
        const uri = await saveImage();
        if (!uri) {
          Alert.alert(t("common.error"), t("errors.generic"));
          return; // stop if image upload failed
        }
        updatedData.image = { ...image, uri };
      }

      await saveMoodTask({
        category: TASK_CATEGORY.MOOD,
        data: updatedData,
        day,
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
  }, [
    taskOutputType,
    text,
    image,
    dayMoodData,
    saveImage,
    saveMoodTask,
    day,
    t,
    selectedYear,
    isEditable,
  ]);

  return {
    isEditing,
    text,
    image,
    isLoading,
    setIsLoading,
    setImage,
    handleTaskRemove,
    handleTextChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    isEditable,
  };
};
