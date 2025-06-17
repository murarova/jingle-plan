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
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TASK_CATEGORY } from "../../../constants/constants";
import uuid from "react-native-uuid";
import { Alert } from "react-native";
import isEmpty from "lodash/isEmpty";
import { ActionButtons, Loader } from "../../common";
import { TextData } from "../../../types/types";
import {
  removeTaskAsync,
  saveTaskByCategoryAsync,
} from "../../../services/data-api";
import { useAppDispatch, useAppSelector } from "../../../store/withTypes";

interface GoalsProps {
  context: string;
  data: TextData | null;
}

interface GoalsFormProps {
  initialText: string;
  onSubmit: (text: string) => void;
  placeholderText: string;
  submitButtonText: string;
}

const GoalsForm = memo(
  ({
    initialText,
    onSubmit,
    placeholderText,
    submitButtonText,
  }: GoalsFormProps) => {
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
          />
        </Textarea>
        <Button
          onPress={handleSubmit}
          borderRadius="$lg"
          accessibilityLabel="Save goals"
        >
          <ButtonText>{submitButtonText}</ButtonText>
        </Button>
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
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.app);

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
        await dispatch(
          saveTaskByCategoryAsync({
            category: TASK_CATEGORY.GOALS,
            data: updatedGoal,
            context,
          })
        ).unwrap();

        setText(submittedText);
        setIsEditing(false);
      } catch (error) {
        Alert.alert(t("common.error"), t("errors.generic"));
        console.error("Failed to save goal:", error);
      }
    },
    [dispatch, context, data?.id, t]
  );

  const handleRemove = useCallback(async () => {
    try {
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.GOALS,
          context,
        })
      ).unwrap();
      setText("");
      setIsEditing(true);
    } catch (error) {
      Alert.alert(
        t("common.error"),
        t("errors.generic", "Something went wrong. Please try again.")
      );
      console.error("Failed to remove goal:", error);
    }
  }, [dispatch, context, t]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

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
      {status === "pending" && <Loader absolute />}
      {isEditing ? (
        <GoalsForm
          initialText={text}
          onSubmit={handleSubmit}
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
