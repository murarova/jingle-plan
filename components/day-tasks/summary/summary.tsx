import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { TASK_CATEGORY } from "../../../constants/constants";
import uuid from "react-native-uuid";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import { HappySlider } from "./happy-slider";
import { ActionButtons } from "../../common";
import { SummaryContextData } from "../../../types/types";
import {
  useRemoveTaskMutation,
  useSaveTaskByCategoryMutation,
} from "../../../services/api";
import { useAppSelector } from "../../../store/withTypes";

interface SummaryProps {
  context: string;
  data: SummaryContextData | null;
}

export function Summary({ context, data }: SummaryProps): React.JSX.Element {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const [saveTaskByCategory, { isLoading: isSaving }] =
    useSaveTaskByCategoryMutation();
  const [removeTask, { isLoading: isRemoving }] = useRemoveTaskMutation();
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
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [text, rate, contextData, saveTaskByCategory, context, t, selectedYear]);

  const handleTaskRemove = useCallback(async () => {
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
  }, [removeTask, context, t, selectedYear]);

  const renderEditingMode = () => (
    <VStack space="md" width="100%">
      <HappySlider rate={rate} setRate={handleRateChange} isDisabled={false} />
      <Textarea width="100%">
        <TextareaInput
          onChangeText={handleTextChange}
          value={text}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          onSubmitEditing={handleSubmit}
        />
      </Textarea>
      <HStack space="sm" mt="$2">
        <Button
          flex={1}
          variant="outline"
          onPress={handleCancel}
          borderRadius="$lg"
        >
          <ButtonText>{t("common.cancel")}</ButtonText>
        </Button>
        <Button flex={1} onPress={handleSubmit} borderRadius="$lg">
          <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );

  const renderViewMode = () => (
    <VStack space="md" width="100%">
      <HappySlider rate={rate} setRate={() => {}} isDisabled={true} />
      <Box mb="$2">
        <Text>{contextData?.text || t("common.empty")}</Text>
      </Box>
      <ActionButtons onEdit={handleEdit} onDelete={handleTaskRemove} />
    </VStack>
  );

  return <Box>{isEditing ? renderEditingMode() : renderViewMode()}</Box>;
}

Summary.displayName = "Summary";
