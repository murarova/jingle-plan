import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createProfileAsync,
  createUserAsync,
  signInUserAsync,
  deleteCurrentUserAsync,
  signOutAsync,
} from "../services/auth-api";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { RootState } from "./store";
import { SerializableUser, convertToSerializableUser } from "../types/user";
import { saveUserToStorage, removeUserFromStorage } from "../services/storage";

// Define a type for the slice state
export interface State {
  currentUser: SerializableUser | null;
  userUid: string | null;
  isLoggedIn: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state using that type
const initialState: State = {
  currentUser: null,
  userUid: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    hydrateAuth: (state, action: PayloadAction<SerializableUser | null>) => {
      state.currentUser = action.payload;
      state.userUid = action.payload?.uid || null;
      state.isLoggedIn = !!action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    // createProfileAsync
    builder.addCase(createProfileAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(createProfileAsync.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(createProfileAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to create profile";
    });

    // createUserAsync
    builder.addCase(createUserAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      createUserAsync.fulfilled,
      (state, action: PayloadAction<SerializableUser>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      }
    );
    builder.addCase(createUserAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to create user";
    });

    // signInUserAsync
    builder.addCase(signInUserAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      signInUserAsync.fulfilled,
      (state, action: PayloadAction<SerializableUser>) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.currentUser = action.payload;
        state.userUid = action.payload.uid;
        // Persist user data
        saveUserToStorage(action.payload);
      }
    );
    builder.addCase(signInUserAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to sign in";
    });

    // deleteCurrentUserAsync
    builder.addCase(deleteCurrentUserAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(deleteCurrentUserAsync.fulfilled, (state) => {
      state.status = "succeeded";
      state.currentUser = null;
    });
    builder.addCase(deleteCurrentUserAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to delete user";
    });

    // signOutAsync
    builder.addCase(signOutAsync.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(signOutAsync.fulfilled, (state) => {
      state.status = "succeeded";
      state.isLoggedIn = false;
      state.currentUser = null;
      state.userUid = null;
      // Remove persisted user data
      removeUserFromStorage();
    });
    builder.addCase(signOutAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to sign out";
    });
  },
});

export const { hydrateAuth } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
