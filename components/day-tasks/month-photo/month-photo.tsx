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
import { TASK_CATEGORY } from "../../../constants/constants";
import isEmpty from "lodash/isEmpty";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { ActionButtons, AnimatedView, ImagePicker, Loader } from "../../common";
import { ImageBackground } from "@gluestack-ui/themed";
import { MonthPhotoData, TextImageData } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../store/withTypes";
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

interface MonthPhotoFormProps {
  text: string;
  image: any;
  isImageLoading: boolean;
  onTextChange: (text: string) => void;
  onImageChange: (image: any) => void;
  onSubmit: () => void;
  setImageLoading: (loading: boolean) => void;
}

const MonthPhotoForm = memo(
  ({
    text,
    image,
    isImageLoading,
    onTextChange,
    onImageChange,
    onSubmit,
    setImageLoading,
  }: MonthPhotoFormProps) => {
    const { t } = useTranslation();

    return (
      <VStack space="md" width="100%">
        <ImagePicker
          setIsImageLoading={setImageLoading}
          isImageLoading={isImageLoading}
          edit={true}
          setImage={onImageChange}
          image={image}
        />
        <Textarea width="100%" mt="$4">
          <TextareaInput
            onChangeText={onTextChange}
            value={text}
            placeholder={t("screens.tasksOfTheDay.textareaPlaceholder")}
          />
        </Textarea>
        <Button onPress={onSubmit} mt="$2" borderRadius="$lg">
          <ButtonText>{t("screens.tasksOfTheDay.submitBtnText")}</ButtonText>
        </Button>
      </VStack>
    );
  }
);

MonthPhotoForm.displayName = "MonthPhotoForm";

interface MonthPhotoViewProps {
  image: any;
  text: string | undefined;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MonthPhotoView = memo(
  ({ image, text, isLoading, onEdit, onDelete }: MonthPhotoViewProps) => (
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
      {text && (
        <Box mt="$2">
          <Text>{text}</Text>
        </Box>
      )}
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </Box>
  )
);

MonthPhotoView.displayName = "MonthPhotoView";

export const MonthPhoto = memo(({ context, data }: MonthPhotoProps) => {
  const contextData = data?.[context];
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const { status } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { saveImage, setImage, image, isLoading, setIsLoading } = useImage();

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
      setText("");
      setImage(null);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [dispatch, image, context, t, setImage]);

  const handleTaskSubmit = useCallback(async () => {
    if (!image) {
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
        updatedData.image = { ...image, uri };
      }

      await dispatch(
        saveTaskByCategoryAsync({
          category: TASK_CATEGORY.MONTH_PHOTO,
          data: updatedData,
          context,
        })
      ).unwrap();

      setIsEditing(false);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  }, [image, text, contextData, dispatch, context, saveImage, t]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  return (
    <Box>
      {status === "pending" && <Loader absolute />}

      {isEditing ? (
        <MonthPhotoForm
          text={text}
          image={image}
          isImageLoading={isLoading}
          onTextChange={handleTextChange}
          onImageChange={setImage}
          onSubmit={handleTaskSubmit}
          setImageLoading={setIsLoading}
        />
      ) : (
        <MonthPhotoView
          image={image}
          text={contextData?.text}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleTaskRemove}
        />
      )}
    </Box>
  );
});

MonthPhoto.displayName = "MonthPhoto";
