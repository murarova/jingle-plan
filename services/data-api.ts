import { selectCurrentUser } from "../store/authReducer";
import { createAppAsyncThunk } from "../store/withTypes";
import { ImageData, TaskGategory, TextImageData } from "../types/types";
import {
  getConfiguration,
  saveMoodTask,
  getUserData,
  saveImage,
  deleteImage,
  getImageUrl,
  removeTask,
  saveTaskByCategory,
} from "./services";

// For saveTaskByCategory
export const saveTaskByCategoryAsync = createAppAsyncThunk<
  void,
  { category: TaskGategory; data: any; context: string }
>(
  "user/saveTaskByCategory",
  async ({ category, data, context }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    await saveTaskByCategory({ category, data, context, currentUser });
  }
);

// For getConfiguration
export const getConfigurationAsync = createAppAsyncThunk<any, void>(
  "user/getConfiguration",
  async () => {
    return await getConfiguration();
  }
);

// For saveMoodTask
export const saveMoodTaskAsync = createAppAsyncThunk<
  TextImageData,
  { category: TaskGategory; data: TextImageData; day: string }
>("user/saveMoodTask", async ({ category, data, day }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await saveMoodTask({ category, data, day, currentUser });
  return data;
});

// For getUserData
export const getUserDataAsync = createAppAsyncThunk<any, void>(
  "user/getUserData",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserData(currentUser?.uid);
  }
);

// For saveImage
export const saveImageAsync = createAppAsyncThunk<void, { image: ImageData }>(
  "user/saveImage",
  async ({ image }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    await saveImage(image, currentUser);
  }
);

// For deleteImage
export const deleteImageAsync = createAppAsyncThunk<void, { image: ImageData }>(
  "user/deleteImage",
  async ({ image }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    await deleteImage(image, currentUser);
  }
);

// For getImageUrl
export const getImageUrlAsync = createAppAsyncThunk<string, { id: string }>(
  "user/getImageUrl",
  async ({ id }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    const url = await getImageUrl(id, currentUser);
    if (url) {
      return url;
    } else {
      throw new Error("Image URL not found");
    }
  }
);

// For removeTask
export const removeTaskAsync = createAppAsyncThunk<
  void,
  { category: TaskGategory; context: string; day?: string }
>("user/removeTask", async ({ category, context, day }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await removeTask({ category, context, currentUser, day });
});
