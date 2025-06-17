import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  VStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { TASK_CATEGORY } from "../../../constants/constants";
import uuid from "react-native-uuid";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import { HappySlider } from "./happy-slider";
import { ActionButtons, Loader } from "../../common";
import { SummaryContextData } from "../../../types/types";
import {
  removeTaskAsync,
  saveTaskByCategoryAsync,
} from "../../../services/data-api";
import { useAppDispatch, useAppSelector } from "../../../store/withTypes";

interface SummaryProps {
  context: string;
  data: SummaryContextData | null;
}

export function Summary({ context, data }: SummaryProps): React.JSX.Element {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.app);

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
      await dispatch(
        saveTaskByCategoryAsync({
          category: TASK_CATEGORY.SUMMARY,
          data: updatedSummary,
          context,
        })
      ).unwrap();
      setIsEditing(false);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [text, rate, contextData, dispatch, context, t]);

  const handleTaskRemove = useCallback(async () => {
    try {
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.SUMMARY,
          context,
        })
      ).unwrap();
      setText("");
      setRate(50);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [dispatch, context, t]);

  const renderEditingMode = () => (
    <VStack space="md" width="100%">
      <HappySlider rate={rate} setRate={handleRateChange} isDisabled={false} />
      <Textarea width="100%">
        <TextareaInput
          onChangeText={handleTextChange}
          value={text}
          placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
        />
      </Textarea>
      <Button onPress={handleSubmit} mt="$2" borderRadius="$lg">
        <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
      </Button>
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

  return (
    <Box>
      {status === "pending" && <Loader absolute />}
      {isEditing ? renderEditingMode() : renderViewMode()}
    </Box>
  );
}

Summary.displayName = "Summary";
