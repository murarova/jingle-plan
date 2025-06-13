import {
  Box,
  Text,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TASK_CATEGORY } from "../../../constants/constants";
import uuid from "react-native-uuid";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import { HappySlider } from "./happy-slider";
import { ActionButtons } from "../../common";
import { SummaryContextData } from "../../../types/types";
import {
  removeTaskAsync,
  saveTaskByCategoryAsync,
} from "../../../services/data-api";
import { useAppDispatch } from "../../../store/withTypes";

interface SummaryProps {
  context: string;
  data: SummaryContextData | null;
}

export function Summary({ context, data }: SummaryProps) {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [rate, setRate] = useState(50);
  const [edit, setEdit] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isEmpty(contextData)) {
      setEdit(true);
    } else {
      setEdit(false);
    }

    if (contextData?.text) {
      setText(contextData.text);
    }
    if (contextData?.rate) {
      setRate(contextData.rate);
    }
  }, [contextData]);

  async function onTaskSubmit() {
    const id = contextData?.id ?? uuid.v4();
    if (!text.trim()) {
      Alert.alert("Oops", "Please add some text");
      return;
    }
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
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setEdit(false);
    }
  }

  async function handleTaskRemove() {
    try {
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.SUMMARY,
          context,
        })
      ).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setText("");
      setRate(50);
    }
  }

  return (
    <Box>
      <HappySlider rate={rate} setRate={setRate} isDisabled={!edit} />
      {edit ? (
        <>
          <Textarea width="100%">
            <TextareaInput
              onChangeText={setText}
              defaultValue={text}
              placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
            />
          </Textarea>
          <Button onPress={onTaskSubmit} mt="$2" borderRadius="$lg">
            <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
          </Button>
        </>
      ) : (
        <Box>
          <Box mb="$2">
            <Text>{contextData?.text || t("common.empty")}</Text>
          </Box>
          <ActionButtons
            onEdit={() => setEdit(true)}
            onDelete={handleTaskRemove}
          />
        </Box>
      )}
    </Box>
  );
}
