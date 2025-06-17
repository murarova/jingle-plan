import {
  Box,
  Button,
  ButtonText,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useEffect, useState } from "react";
import { TASK_CATEGORY, TaskOutputType } from "../../../constants/constants";
import {
  deleteImageAsync,
  removeTaskAsync,
  saveMoodTaskAsync,
} from "../../../services/data-api";
import { useAppDispatch, useAppSelector } from "../../../store/withTypes";
import isEmpty from "lodash/isEmpty";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { ActionButtons, AnimatedView, ImagePicker, Loader } from "../../common";
import { ImageBackground } from "@gluestack-ui/themed";
import { useImage } from "../../../hooks/useImage";
import { MoodTaskData, TextImageData } from "../../../types/types";

interface MoodProps {
  data: MoodTaskData | null;
  day: string;
  taskOutputType: TaskOutputType;
}

interface MoodFormProps {
  text: string;
  taskOutputType: TaskOutputType;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  image: any;
  isImageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  setImage: (image: any) => void;
}

const MoodForm = memo(
  ({
    text,
    taskOutputType,
    onTextChange,
    onSubmit,
    image,
    isImageLoading,
    setImageLoading,
    setImage,
  }: MoodFormProps) => {
    const { t } = useTranslation();

    const showText =
      taskOutputType === TaskOutputType.Text ||
      taskOutputType === TaskOutputType.TextPhoto;
    const showImage =
      taskOutputType === TaskOutputType.Image ||
      taskOutputType === TaskOutputType.TextPhoto;

    return (
      <VStack space="md" width="100%">
        {showText && (
          <Textarea width="100%" mb="$4">
            <TextareaInput
              onChangeText={onTextChange}
              value={text}
              placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
            />
          </Textarea>
        )}

        {showImage && (
          <ImagePicker
            setIsImageLoading={setImageLoading}
            isImageLoading={isImageLoading}
            edit={true}
            setImage={setImage}
            image={image}
          />
        )}

        <Button onPress={onSubmit} mt="$2" borderRadius="$lg">
          <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
        </Button>
      </VStack>
    );
  }
);

MoodForm.displayName = "MoodForm";

interface MoodViewProps {
  text?: string;
  image: any;
  isImageLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MoodView = memo(
  ({ text, image, isImageLoading, onEdit, onDelete }: MoodViewProps) => (
    <Box>
      {text && (
        <Box mb="$2">
          <Text>{text}</Text>
        </Box>
      )}

      {image && (
        <Box flex={1}>
          {isImageLoading && (
            <Box
              position="absolute"
              backgroundColor="$blueGray100"
              opacity="$60"
              top="$0"
              bottom="$0"
              left="$0"
              right="$0"
              zIndex={2}
            >
              <Loader size="large" />
            </Box>
          )}
          <AnimatedView style={{ zIndex: 1 }} show={!isImageLoading}>
            <Box height={300} width="100%" flex={1}>
              <ImageBackground
                style={{ flex: 1, justifyContent: "center" }}
                src={image?.uri}
                resizeMode="contain"
              />
            </Box>
          </AnimatedView>
        </Box>
      )}

      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  )
);

MoodView.displayName = "MoodView";

export const MoodTask = memo(({ data, day, taskOutputType }: MoodProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.app);

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
    try {
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.MOOD,
          context: "",
          day,
        })
      ).unwrap();

      if (image) {
        await dispatch(deleteImageAsync({ image })).unwrap();
      }

      setText("");
      setImage(null);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [dispatch, day, image, setImage, t]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    const needsText =
      taskOutputType === TaskOutputType.Text ||
      taskOutputType === TaskOutputType.TextPhoto;
    const needsImage =
      taskOutputType === TaskOutputType.Image ||
      taskOutputType === TaskOutputType.TextPhoto;

    if (needsText && !text.trim() && needsImage && !image) {
      Alert.alert(t("common.error"), t("errors.emptyText"));
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
        updatedData.image = { ...image, uri };
      }

      await dispatch(
        saveMoodTaskAsync({
          category: TASK_CATEGORY.MOOD,
          data: updatedData,
          day,
        })
      ).unwrap();

      setIsEditing(false);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [taskOutputType, text, image, dayMoodData, saveImage, dispatch, day, t]);

  return (
    <Box>
      {status === "pending" && <Loader absolute />}

      {isEditing ? (
        <MoodForm
          text={text}
          taskOutputType={taskOutputType}
          onTextChange={handleTextChange}
          onSubmit={handleSubmit}
          image={image}
          isImageLoading={isLoading}
          setImageLoading={setIsLoading}
          setImage={setImage}
        />
      ) : (
        <MoodView
          text={dayMoodData?.text}
          image={image}
          isImageLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleTaskRemove}
        />
      )}
    </Box>
  );
});

MoodTask.displayName = "MoodTask";
