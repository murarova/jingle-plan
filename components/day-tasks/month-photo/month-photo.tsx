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
import { TASK_CATEGORY } from "../../../constants/constants";
import isEmpty from "lodash/isEmpty";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { ActionButtons, AnimatedView, ImagePicker, Loader } from "../../common";
import { ImageBackground } from "@gluestack-ui/themed";
import { MonthPhotoData, TextImageData } from "../../../types/types";
import { useAppDispatch } from "../../../store/withTypes";
import {
  saveTaskByCategoryAsync,
  deleteImageAsync,
  removeTaskAsync,
} from "../../../services/data-api";
import { useImage } from "../../../hooks/useImage";

interface MonthPhotoProps {
  context: string;
  data: MonthPhotoData | null;
}

export function MonthPhoto({ context, data }: MonthPhotoProps) {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const { saveImage, setImage, image, isLoading, setIsLoading } = useImage();

  useEffect(() => {
    if (isEmpty(contextData)) {
      setEdit(true);
    } else {
      setEdit(false);
    }
    if (contextData?.text) {
      setText(contextData.text);
    }
    if (contextData?.image) {
      setImage(contextData?.image);
    }
  }, [contextData]);

  async function handleTaskRemove() {
    try {
      if (image) {
        await dispatch(deleteImageAsync({ image })).unwrap();
      }
      await dispatch(
        removeTaskAsync({
          category: TASK_CATEGORY.MONTH_PHOTO,
          context,
        })
      ).unwrap();
    } catch (error) {
      Alert.alert("Oops", "Something wrong");
    } finally {
      setText("");
      setImage(null);
    }
  }

  async function onTaskSubmit() {
    if (image) {
      setEdit(false);
      const id = contextData?.id ?? uuid.v4();

      const updatedData = {
        id,
        text,
        image,
      } as TextImageData;
      try {
        if (contextData?.image?.uri !== image?.uri) {
          await saveImage();
          updatedData.image = { ...image, uri: image?.uri };
        }

        await dispatch(
          saveTaskByCategoryAsync({
            category: TASK_CATEGORY.MONTH_PHOTO,
            data: updatedData,
            context,
          })
        ).unwrap();
      } catch (error) {
        Alert.alert("Oops", "Something wrong");
      }
    } else {
      Alert.alert("Помилка", "Будь ласка додайте фото");
    }
  }

  return (
    <Box>
      {edit ? (
        <>
          <ImagePicker
            setIsImageLoading={setIsLoading}
            isImageLoading={isLoading}
            edit={edit}
            setImage={setImage}
            image={image}
          />
          <Textarea width="100%" mt="$4">
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
          {contextData?.text && (
            <Box mt="$2">
              <Text>{contextData?.text}</Text>
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
