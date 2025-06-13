import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
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
import { CalendarConfig, UserData, MoodTaskData } from "../types/types";
import { TASK_CATEGORY } from "../constants/constants";
import { isEmpty } from "lodash";

export interface State {
  configuration: CalendarConfig | null;
  userData: UserData | null;
  imageUrl: string | null;
  progress: null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: State = {
  configuration: null,
  userData: null as UserData | null,
  imageUrl: null,
  progress: null,
  status: "idle",
  error: null,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    // Add other reducers here if needed
  },
  extraReducers: (builder) => {
    // saveTaskByCategoryAsync
    builder.addCase(saveTaskByCategoryAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(saveTaskByCategoryAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (state.userData) {
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
      }
    });
    builder.addCase(saveTaskByCategoryAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to save task";
    });

    // getConfigurationAsync
    builder.addCase(getConfigurationAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      getConfigurationAsync.fulfilled,
      (state, action: PayloadAction<CalendarConfig>) => {
        state.status = "succeeded";
        state.configuration = action.payload;
      }
    );
    builder.addCase(getConfigurationAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch configuration";
    });

    // saveMoodTaskAsync
    builder.addCase(saveMoodTaskAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(saveMoodTaskAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (state.userData) {
        const { day } = action.meta.arg;
        const data = action.payload;

        if (!state.userData[TASK_CATEGORY.MOOD]) {
          state.userData[TASK_CATEGORY.MOOD] = {};
        }

        const moodData = state.userData[TASK_CATEGORY.MOOD]!;
        moodData[day] = data;
      }
    });
    builder.addCase(saveMoodTaskAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to save mood task";
    });

    // getUserDayTasksAsync
    // builder.addCase(getUserDayTasksAsync.pending, (state) => {
    //   state.status = "pending";
    // });
    // builder.addCase(
    //   getUserDayTasksAsync.fulfilled,
    //   (state, action: PayloadAction<any>) => {
    //     state.status = "succeeded";
    //     state.userData = action.payload;
    //   }
    // );
    // builder.addCase(getUserDayTasksAsync.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message || "Failed to fetch user day tasks";
    // });

    // getUserDataAsync
    builder.addCase(getUserDataAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      getUserDataAsync.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.userData = action.payload;
      }
    );
    builder.addCase(getUserDataAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch user data";
    });

    // // getUserSummaryAsync
    // builder.addCase(getUserSummaryAsync.pending, (state) => {
    //   state.status = "pending";
    // });
    // builder.addCase(getUserSummaryAsync.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.status = "succeeded";
    //   state.currentUser = { ...state.currentUser, summary: action.payload };
    // });
    // builder.addCase(getUserSummaryAsync.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message || 'Failed to fetch user summary';
    // });

    // // getUserPlansAsync
    // builder.addCase(getUserPlansAsync.pending, (state) => {
    //   state.status = "pending";
    // });
    // builder.addCase(getUserPlansAsync.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.status = "succeeded";
    //   state.currentUser = { ..state.currentUser, plans: action.payload };
    // });
    // builder.addCase(getUserPlansAsync.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message || 'Failed to fetch user plans';
    // });

    // // getUserGlobalGoalAsync
    // builder.addCase(getUserGlobalGoalAsync.pending, (state) => {
    //   state.status = "pending";
    // });
    // builder.addCase(getUserGlobalGoalAsync.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.status = "succeeded";
    //   state.currentUser = { ..state.currentUser, globalGoal: action.payload };
    // });
    // builder.addCase(getUserGlobalGoalAsync.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message || 'Failed to fetch global goal';
    // });

    // // getUserPhotosAsync
    // builder.addCase(getUserPhotosAsync.pending, (state) => {
    //   state.status = "pending";
    // });
    // builder.addCase(getUserPhotosAsync.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.status = "succeeded";
    //   state.currentUser = { ...state.currentUser, photos: action.payload };
    // });
    // builder.addCase(getUserPhotosAsync.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message || 'Failed to fetch user photos';
    // });

    // saveImageAsync
    builder.addCase(saveImageAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(saveImageAsync.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(saveImageAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to save image";
    });

    // deleteImageAsync
    builder.addCase(deleteImageAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(deleteImageAsync.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(deleteImageAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to delete image";
    });

    // getImageUrlAsync
    builder.addCase(getImageUrlAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      getImageUrlAsync.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.imageUrl = action.payload;
      }
    );
    builder.addCase(getImageUrlAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch image URL";
    });

    // removeTaskAsync
    builder.addCase(removeTaskAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(removeTaskAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (state.userData) {
        const { category } = action.meta.arg;
        switch (category) {
          case TASK_CATEGORY.MONTH_PHOTO:
            state.userData[TASK_CATEGORY.MONTH_PHOTO] = null;
            break;
          case TASK_CATEGORY.GOALS:
            state.userData[TASK_CATEGORY.GOALS] = null;
            break;
          case TASK_CATEGORY.SUMMARY:
            state.userData[TASK_CATEGORY.SUMMARY] = null;
            break;
          case TASK_CATEGORY.PLANS:
            state.userData[TASK_CATEGORY.PLANS] = null;
            break;
          case TASK_CATEGORY.MOOD:
            if (state.userData[TASK_CATEGORY.MOOD] && action.meta.arg.day) {
              const moodData = state.userData[
                TASK_CATEGORY.MOOD
              ] as MoodTaskData;
              delete moodData[action.meta.arg.day];
            }
            break;
        }
      }
    });
    builder.addCase(removeTaskAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to remove task";
    });

    getImageUrlAsync;
  },
});
// export const {} = appSlice.actions;

export default appSlice.reducer;
