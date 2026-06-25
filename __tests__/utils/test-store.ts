import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../store/appReducer";
import authReducer from "../../store/authReducer";
import { api } from "../../services/api";
import { authApi } from "../../services/auth-api-rtk";
import type { RootState } from "../../store/store";

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
      [api.reducerPath]: api.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            api.util.resetApiState.type,
            authApi.util.resetApiState.type,
          ],
        },
      })
        .concat(api.middleware)
        .concat(authApi.middleware),
    preloadedState: preloadedState as RootState | undefined,
  });
}
