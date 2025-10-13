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
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TASK_CATEGORY } from "../../../constants/constants";
import uuid from "react-native-uuid";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import { ActionButtons, Loader } from "../../common";
import { TextData } from "../../../types/types";
import {
  useRemoveTaskMutation,
  useSaveTaskByCategoryMutation,
} from "../../../services/api";
import { useAppSelector } from "../../../store/withTypes";

interface GoalsProps {
  context: string;
  data: TextData | null;
}

interface GoalsFormProps {
  initialText: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholderText: string;
  submitButtonText: string;
}

const GoalsForm = memo(
  ({
    initialText,
    onSubmit,
    onCancel,
    placeholderText,
    submitButtonText,
  }: GoalsFormProps) => {
    const { t } = useTranslation();
    const [text, setText] = useState(initialText);

    const handleSubmit = useCallback(() => {
      onSubmit(text);
    }, [text, onSubmit]);

    return (
      <VStack space="md" width="100%">
        <Textarea width="100%">
          <TextareaInput
            onChangeText={setText}
            value={text}
            placeholder={placeholderText}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            onSubmitEditing={handleSubmit}
          />
        </Textarea>
        <HStack space="sm" mt="$2">
          <Button
            flex={1}
            variant="outline"
            onPress={onCancel}
            borderRadius="$lg"
          >
            <ButtonText>{t("common.cancel")}</ButtonText>
          </Button>
          <Button
            flex={1}
            onPress={handleSubmit}
            borderRadius="$lg"
            accessibilityLabel="Save goals"
          >
            <ButtonText>{submitButtonText}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    );
  }
);

GoalsForm.displayName = "GoalsForm";

interface GoalsViewProps {
  text: string;
  emptyText: string;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalsView = memo(
  ({ text, emptyText, onEdit, onDelete }: GoalsViewProps) => (
    <Box>
      <Box mb="$2">
        <Text>{text || emptyText}</Text>
      </Box>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  )
);

GoalsView.displayName = "GoalsView";

export const Goals = memo(({ context, data }: GoalsProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveTaskByCategory, { isLoading: isSaving }] =
    useSaveTaskByCategoryMutation();
  const [removeTask, { isLoading: isRemoving }] = useRemoveTaskMutation();
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
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
        console.error("Failed to save goal:", error);
      }
    },
    [saveTaskByCategory, context, data?.id, t, selectedYear]
  );

  const handleRemove = useCallback(async () => {
    try {
      await removeTask({
        category: TASK_CATEGORY.GOALS,
        context,
        year: selectedYear,
      }).unwrap();
      setText("");
      setIsEditing(true);
    } catch (error) {
      Alert.alert(
        t("common.error"),
        t("errors.generic", "Something went wrong. Please try again.")
      );
      console.error("Failed to remove goal:", error);
    }
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

  const placeholderText = useMemo(
    () => t("screens.tasksOfTheDay.textareaPlaceholder"),
    [t]
  );

  const submitButtonText = useMemo(
    () => t("screens.tasksOfTheDay.submitBtnText"),
    [t]
  );

  const emptyText = useMemo(() => t("common.empty"), [t]);

  return (
    <Box width="100%">
      {(isSaving || isRemoving) && <Loader absolute />}
      {isEditing ? (
        <GoalsForm
          initialText={text}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          placeholderText={placeholderText}
          submitButtonText={submitButtonText}
        />
      ) : (
        <GoalsView
          text={text}
          emptyText={emptyText}
          onEdit={handleEdit}
          onDelete={handleRemove}
        />
      )}
    </Box>
  );
});

Goals.displayName = "Goals";
