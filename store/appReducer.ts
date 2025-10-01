import {
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import {
  saveTaskByCategoryAsync,
  getConfigurationAsync,
  saveMoodTaskAsync,
  getUserDataAsync,
  saveImageAsync,
  deleteImageAsync,
  getImageUrlAsync,
  removeTaskAsync,
} from "../services/data-api";
import {
  CalendarConfig,
  UserData,
  MoodTaskData,
  SummaryContextData,
  MonthPhotoData,
  PlanContextData,
} from "../types/types";
import { TASK_CATEGORY, YEARS } from "../constants/constants";
import { isEmpty, omit } from "lodash";

export type RequestStatus = "idle" | "pending" | "succeeded" | "failed";

export interface AppState {
  configuration: CalendarConfig | null;
  userData: UserData | null;
  imageUrl: string | null;
  selectedYear: string;
  status: RequestStatus;
  error: string | null;
}

const initialState: AppState = {
  configuration: null,
  userData: null,
  imageUrl: null,
  selectedYear: YEARS[YEARS.length - 1],
  status: "idle",
  error: null,
};

/**
 * Helper functions to avoid repetitive code in the reducers
 */
const setPendingState = (state: AppState) => {
  state.status = "pending";
  state.error = null;
};

const setFailedState = (state: AppState, action: any) => {
  state.status = "failed";
  state.error = action.error.message || "An error occurred";
};

const setSucceededState = (state: AppState) => {
  state.status = "succeeded";
  state.error = null;
};

/**
 * Add category-specific reducers to the builder
 */
const addTaskCategoryCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(saveTaskByCategoryAsync.pending, setPendingState)
    .addCase(saveTaskByCategoryAsync.fulfilled, (state, action) => {
      setSucceededState(state);
      if (!state.userData) return;

      const { category, data, context } = action.meta.arg;

      switch (category) {
        case TASK_CATEGORY.PLANS:
          const plans = isEmpty(data) ? null : data;
          state.userData[TASK_CATEGORY.PLANS] = {
            ...(state.userData[TASK_CATEGORY.PLANS] || {}),
            [context]: plans,
          };
          break;

        case TASK_CATEGORY.SUMMARY:
          state.userData[TASK_CATEGORY.SUMMARY] = {
            ...(state.userData[TASK_CATEGORY.SUMMARY] || {}),
            [context]: data,
          };
          break;

        case TASK_CATEGORY.MONTH_PHOTO:
          state.userData[TASK_CATEGORY.MONTH_PHOTO] = {
            ...(state.userData[TASK_CATEGORY.MONTH_PHOTO] || {}),
            [context]: data,
          };
          break;

        case TASK_CATEGORY.GOALS:
          state.userData[TASK_CATEGORY.GOALS] = data;
          break;
      }
    })
    .addCase(saveTaskByCategoryAsync.rejected, setFailedState);
};

/**
 * Add configuration reducers to the builder
 */
const addConfigurationCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(getConfigurationAsync.pending, setPendingState)
    .addCase(
      getConfigurationAsync.fulfilled,
      (state, action: PayloadAction<CalendarConfig>) => {
        setSucceededState(state);
        state.configuration = action.payload;
      }
    )
    .addCase(getConfigurationAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to fetch configuration";
    });
};

/**
 * Add mood task reducers to the builder
 */
const addMoodTaskCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(saveMoodTaskAsync.pending, setPendingState)
    .addCase(saveMoodTaskAsync.fulfilled, (state, action) => {
      setSucceededState(state);
      if (!state.userData) return;

      const { day } = action.meta.arg;
      const data = action.payload;

      if (!state.userData[TASK_CATEGORY.MOOD]) {
        state.userData[TASK_CATEGORY.MOOD] = {};
      }

      const moodData = state.userData[TASK_CATEGORY.MOOD]!;
      moodData[day] = data;
    })
    .addCase(saveMoodTaskAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to save mood task";
    });
};

/**
 * Add user data reducers to the builder
 */
const addUserDataCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(getUserDataAsync.pending, setPendingState)
    .addCase(
      getUserDataAsync.fulfilled,
      (state, action: PayloadAction<UserData>) => {
        setSucceededState(state);
        state.userData = action.payload;
      }
    )
    .addCase(getUserDataAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to fetch user data";
    });
};

/**
 * Add image operations reducers to the builder
 */
const addImageOperationsCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(saveImageAsync.pending, setPendingState)
    .addCase(saveImageAsync.fulfilled, (state) => {
      setSucceededState(state);
    })
    .addCase(saveImageAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to save image";
    })
    .addCase(deleteImageAsync.pending, setPendingState)
    .addCase(deleteImageAsync.fulfilled, (state) => {
      setSucceededState(state);
    })
    .addCase(deleteImageAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to delete image";
    })
    .addCase(getImageUrlAsync.pending, setPendingState)
    .addCase(
      getImageUrlAsync.fulfilled,
      (state, action: PayloadAction<string>) => {
        setSucceededState(state);
        state.imageUrl = action.payload;
      }
    )
    .addCase(getImageUrlAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to fetch image URL";
    });
};

/**
 * Add task removal reducers to the builder
 */
const addRemoveTaskCase = (builder: ActionReducerMapBuilder<AppState>) => {
  builder
    .addCase(removeTaskAsync.pending, setPendingState)
    .addCase(removeTaskAsync.fulfilled, (state, action) => {
      setSucceededState(state);
      if (!state.userData) return;

      const { category } = action.meta.arg;
      switch (category) {
        case TASK_CATEGORY.MONTH_PHOTO: {
          const monthPhotoData = state.userData[
            TASK_CATEGORY.MONTH_PHOTO
          ] as MonthPhotoData;
          if (!monthPhotoData || !action.meta.arg.context) break;

          const updatedData = omit(monthPhotoData, [action.meta.arg.context]);
          state.userData[TASK_CATEGORY.MONTH_PHOTO] = isEmpty(updatedData)
            ? null
            : updatedData;
          break;
        }

        case TASK_CATEGORY.GOALS:
          state.userData[TASK_CATEGORY.GOALS] = null;
          break;

        case TASK_CATEGORY.SUMMARY: {
          const summaryData = state.userData[
            TASK_CATEGORY.SUMMARY
          ] as SummaryContextData;
          if (!summaryData || !action.meta.arg.context) break;

          const updatedValues = omit(summaryData, [action.meta.arg.context]);
          state.userData[TASK_CATEGORY.SUMMARY] = isEmpty(updatedValues)
            ? null
            : updatedValues;
          break;
        }

        case TASK_CATEGORY.PLANS: {
          const plansData = state.userData[
            TASK_CATEGORY.PLANS
          ] as PlanContextData;
          if (!plansData || !action.meta.arg.context) break;

          const updatedPlans = omit(plansData, [action.meta.arg.context]);
          state.userData[TASK_CATEGORY.PLANS] = isEmpty(updatedPlans)
            ? null
            : updatedPlans;
          break;
        }

        case TASK_CATEGORY.MOOD:
          if (action.meta.arg.day) {
            const moodData = state.userData[TASK_CATEGORY.MOOD] as MoodTaskData;
            if (moodData) {
              delete moodData[action.meta.arg.day];
            }
          }
          break;
      }
    })
    .addCase(removeTaskAsync.rejected, (state, action) => {
      setFailedState(state, action);
      state.error = action.error.message || "Failed to remove task";
    });
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.imageUrl = null;
    },
  },
  extraReducers: (builder) => {
    addTaskCategoryCase(builder);
    addConfigurationCase(builder);
    addMoodTaskCase(builder);
    addUserDataCase(builder);
    addImageOperationsCase(builder);
    addRemoveTaskCase(builder);
  },
});

export const { setSelectedYear, clearUserData } = appSlice.actions;
export const selectSelectedYear = (state: { app: AppState }) =>
  state.app.selectedYear;

export default appSlice.reducer;
