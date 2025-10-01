import { selectCurrentUser } from "../store/authReducer";
import { selectSelectedYear } from "../store/appReducer";
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
    const year = selectSelectedYear(getState());
    await saveTaskByCategory({ category, data, context, currentUser, year });
  }
);

// For getConfiguration
export const getConfigurationAsync = createAppAsyncThunk<any, void>(
  "user/getConfiguration",
  async (_, { getState }) => {
    const year = selectSelectedYear(getState());
    return await getConfiguration(year);
  }
);

// For saveMoodTask
export const saveMoodTaskAsync = createAppAsyncThunk<
  TextImageData,
  { category: TaskGategory; data: TextImageData; day: string }
>("user/saveMoodTask", async ({ category, data, day }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  const year = selectSelectedYear(getState());
  await saveMoodTask({ category, data, day, currentUser, year });
  return data;
});

// For getUserData
export const getUserDataAsync = createAppAsyncThunk<any, void>(
  "user/getUserData",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    const year = selectSelectedYear(getState());
    console.log("getUserDataAsync", currentUser?.uid, year);

    return await getUserData(currentUser?.uid, year);
  }
);

// For saveImage
export const saveImageAsync = createAppAsyncThunk<void, { image: ImageData }>(
  "user/saveImage",
  async ({ image }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    const year = selectSelectedYear(getState());
    await saveImage(image, currentUser, year);
  }
);

// For deleteImage
export const deleteImageAsync = createAppAsyncThunk<void, { image: ImageData }>(
  "user/deleteImage",
  async ({ image }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    const year = selectSelectedYear(getState());
    await deleteImage(image, currentUser, year);
  }
);

// For getImageUrl
export const getImageUrlAsync = createAppAsyncThunk<string, { id: string }>(
  "user/getImageUrl",
  async ({ id }, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    const year = selectSelectedYear(getState());
    const url = await getImageUrl(id, currentUser, year);
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
  const year = selectSelectedYear(getState());
  await removeTask({ category, context, currentUser, day, year });
});
