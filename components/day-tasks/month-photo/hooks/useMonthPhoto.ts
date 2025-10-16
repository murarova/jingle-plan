import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { TASK_CATEGORY } from "../../../../constants/constants";
import isEmpty from "lodash/isEmpty";
import uuid from "react-native-uuid";
import { MonthPhotoData, TextImageData } from "../../../../types/types";
import { useAppSelector } from "../../../../store/withTypes";
import {
  useSaveTaskByCategoryMutation,
  useDeleteImageMutation,
  useRemoveTaskMutation,
} from "../../../../services/api";
import { useImage } from "../../../../hooks/useImage";

interface UseMonthPhotoProps {
  context: string;
  data: MonthPhotoData | null;
}

export const useMonthPhoto = ({ context, data }: UseMonthPhotoProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const [saveTaskByCategory, { isLoading: isSaving }] =
    useSaveTaskByCategoryMutation();
  const [removeTask, { isLoading: isRemoving }] = useRemoveTaskMutation();
  const [deleteImage] = useDeleteImageMutation();
  const { selectedYear } = useAppSelector((state) => state.app);
  const { saveImage, setImage, image, isLoading, setIsLoading } = useImage();

  const contextData = data?.[context];

  useEffect(() => {
    if (isEmpty(contextData)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    if (contextData?.text) {
      setText(contextData.text);
    }
    if (contextData?.image) {
      setImage(contextData?.image);
    }
  }, [contextData, setImage]);

  const handleTaskRemove = useCallback(async () => {
    Alert.alert(t("common.delete"), t("messages.confirmDeleteTask"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            if (image) {
              await deleteImage({ image, year: selectedYear }).unwrap();
            }
            await removeTask({
              category: TASK_CATEGORY.MONTH_PHOTO,
              context,
              year: selectedYear,
            }).unwrap();
            setText("");
            setImage(null);
          } catch (error) {
            Alert.alert(t("common.error"), t("errors.generic"));
          }
        },
      },
    ]);
  }, [deleteImage, removeTask, image, context, t, setImage, selectedYear]);

  const handleTaskSubmit = useCallback(async () => {
    // Validation: Image is required for month photo
    if (!image) {
      Alert.alert(t("common.error"), t("errors.emptyImage"));
      return;
    }

    // Optional: Validate text if provided (should not be just whitespace)
    if (text && !text.trim()) {
      Alert.alert(t("common.error"), t("errors.emptyText"));
      return;
    }
    const id = contextData?.id ?? uuid.v4().toString();

    const updatedData = {
      id,
      text,
      image,
    } as TextImageData;

    try {
      if (contextData?.image?.uri !== image?.uri) {
        const uri = await saveImage();
        if (!uri) {
          Alert.alert(t("common.error"), t("errors.generic"));
          return;
        }
        updatedData.image = { ...image, uri };
      }

      await saveTaskByCategory({
        category: TASK_CATEGORY.MONTH_PHOTO,
        data: updatedData,
        context,
        year: selectedYear,
      }).unwrap();

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }

      setIsEditing(false);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [
    image,
    text,
    contextData,
    saveTaskByCategory,
    context,
    saveImage,
    t,
    selectedYear,
  ]);

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

    if (contextData?.image) {
      setImage(contextData.image);
    } else {
      setImage(null);
    }

    setIsEditing(false);
  }, [contextData, setImage]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  return {
    isEditing,
    text,
    image,
    isLoading,
    isSaving,
    isRemoving,
    setIsLoading,
    setImage,
    handleTaskRemove,
    handleTaskSubmit,
    handleEdit,
    handleCancel,
    handleTextChange,
  };
};
