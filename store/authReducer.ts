import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { SerializableUser } from "../types/user";
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
    setUser: (state, action: PayloadAction<SerializableUser>) => {
      state.currentUser = action.payload;
      state.userUid = action.payload.uid;
      state.isLoggedIn = true;
      state.status = "succeeded";
      state.error = null;
      // Persist user data
      saveUserToStorage(action.payload);
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.userUid = null;
      state.isLoggedIn = false;
      state.status = "idle";
      state.error = null;
      // Remove persisted user data
      removeUserFromStorage();
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    setAuthLoading: (state) => {
      state.status = "pending";
      state.error = null;
    },
  },
});

export const { hydrateAuth, setUser, clearUser, setAuthError, setAuthLoading } =
  authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
