import { selectCurrentUser } from "../store/authReducer";
import { createAppAsyncThunk } from "../store/withTypes";
import {
  getConfiguration,
  saveMoodTask,
  getUserDayTasks,
  getUserData,
  getUserSummary,
  getUserPlans,
  getUserGlobalGoal,
  getUserPhotos,
  saveImage,
  deleteImage,
  getImageUrl,
  removeTask,
  getUserRole,
  saveTaskByCategory,
} from "./services";

// For getUserRole
export const getUserRoleAsync = createAppAsyncThunk<string | null, void>(
  "user/getUserRole",
  async (_, { getState }) => {
    return await getUserRole();
  }
);

// For saveTaskByCategory
export const saveTaskByCategoryAsync = createAppAsyncThunk<
  void,
  { category: string; data: any; context: string }
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
  void,
  { category: string; data: any; day: string }
>("user/saveMoodTask", async ({ category, data, day }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await saveMoodTask({ category, data, day, currentUser });
});

// For getUserDayTasks
// export const getUserDayTasksAsync = createAppAsyncThunk<
//   any,
//   { category: string; context: string }
// >("user/getUserDayTasks", async ({ category, context }, { getState }) => {
//   const currentUser = selectCurrentUser(getState());
//   return await getUserDayTasks(category, context, currentUser);
// });

// For getUserData
export const getUserDataAsync = createAppAsyncThunk<any, void>(
  "user/getUserData",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserData(currentUser?.uid);
  }
);

// For getUserSummary
export const getUserSummaryAsync = createAppAsyncThunk<any, void>(
  "user/getUserSummary",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserSummary(currentUser);
  }
);

// For getUserPlans
export const getUserPlansAsync = createAppAsyncThunk<any, void>(
  "user/getUserPlans",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserPlans(currentUser);
  }
);

// For getUserGlobalGoal
export const getUserGlobalGoalAsync = createAppAsyncThunk<any, void>(
  "user/getUserGlobalGoal",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserGlobalGoal(currentUser);
  }
);

// For getUserPhotos
export const getUserPhotosAsync = createAppAsyncThunk<any, void>(
  "user/getUserPhotos",
  async (_, { getState }) => {
    const currentUser = selectCurrentUser(getState());
    return await getUserPhotos(currentUser);
  }
);

// For saveImage
export const saveImageAsync = createAppAsyncThunk<
  void,
  { image: { id: string; uri: string } }
>("user/saveImage", async ({ image }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await saveImage(image, currentUser);
});

// For deleteImage
export const deleteImageAsync = createAppAsyncThunk<
  void,
  { image: { id: string; uri: string } }
>("user/deleteImage", async ({ image }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await deleteImage(image, currentUser);
});

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
  { category: string; context: string }
>("user/removeTask", async ({ category, context }, { getState }) => {
  const currentUser = selectCurrentUser(getState());
  await removeTask({ category, context, currentUser });
});

// For updateDayProgress
export const updateDayProgressAsync = createAppAsyncThunk<
  void,
  { day: string; dayTaskGrade?: number; moodTaskGrade?: number }
>("user/updateDayProgress", async ({ day, dayTaskGrade, moodTaskGrade }) => {
  // TODO: Implement updating day progress in the backend
  console.warn("Day progress update not implemented yet", {
    day,
    dayTaskGrade,
    moodTaskGrade,
  });
});
