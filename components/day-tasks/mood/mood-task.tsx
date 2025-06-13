import {
  Box,
  Button,
  ButtonText,
  Text,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TASK_CATEGORY, TaskOutputType } from "../../../constants/constants";
import {
  deleteImageAsync,
  removeTaskAsync,
  saveMoodTaskAsync,
} from "../../../services/data-api";
import { useAppDispatch } from "../../../store/withTypes";
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

export function MoodTask({ data, day, taskOutputType }: MoodProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const { saveImage, setImage, image, isLoading, setIsLoading } = useImage();
  const dayMoodData = data ? data[day] : null;

  useEffect(() => {
    if (isEmpty(dayMoodData)) {
      setEdit(true);
    } else {
      setEdit(false);
    }
    if (dayMoodData?.text) {
      setText(dayMoodData.text);
    }
    if (dayMoodData?.image) {
      setImage(dayMoodData?.image);
    }
  }, [dayMoodData]);

  async function handleTaskRemove() {
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
    } catch (error) {
      Alert.alert("Oops", "Something wrong with task deletion");
    } finally {
      setText("");
      setImage(null);
    }
  }

  async function onTaskSubmit() {
    const id = dayMoodData?.id ?? uuid.v4();

    let updatedData: TextImageData = {
      id,
      text,
      image: image || null,
    };

    if (image || text) {
      setEdit(false);
      try {
        if (image) {
          await saveImage();
          updatedData.image = { ...image, uri: image?.uri };
        }
        dispatch(
          saveMoodTaskAsync({
            category: TASK_CATEGORY.MOOD,
            data: updatedData,
            day,
          })
        ).unwrap();
      } catch (error) {
        Alert.alert("Oops", "Something wrong");
      } finally {
      }
    } else {
      Alert.alert("Помилка", "Будь ласка додайте фото");
    }
  }

  return (
    <Box>
      {edit ? (
        <>
          {(taskOutputType === TaskOutputType.Text ||
            taskOutputType === TaskOutputType.TextPhoto) && (
            <>
              <Textarea width="100%" mb="$4">
                <TextareaInput
                  onChangeText={setText}
                  defaultValue={text}
                  placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
                />
              </Textarea>
            </>
          )}

          {(taskOutputType === TaskOutputType.Image ||
            taskOutputType === TaskOutputType.TextPhoto) && (
            <ImagePicker
              setIsImageLoading={setIsLoading}
              isImageLoading={isLoading}
              edit={edit}
              setImage={setImage}
              image={image}
            />
          )}

          {taskOutputType && (
            <Button onPress={onTaskSubmit} mt="$2" borderRadius="$lg">
              <ButtonText>
                {t("screens.tasksOfTheDay.submitBtnText")}
              </ButtonText>
            </Button>
          )}
        </>
      ) : (
        <Box>
          {dayMoodData?.text && (
            <Box mb="$2">
              <Text>{dayMoodData?.text}</Text>
            </Box>
          )}
          {image && (
            <Box flex={1}>
              {isLoading && (
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
              <AnimatedView style={{ zIndex: 1 }} show={!isLoading}>
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
          <ActionButtons
            onEdit={() => setEdit(true)}
            onDelete={handleTaskRemove}
          />
        </Box>
      )}
    </Box>
  );
}
