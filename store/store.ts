import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import { api } from "../services/api";
import { authApi } from "../services/auth-api-rtk";

const apiCachePaths = [api.reducerPath, authApi.reducerPath];

export const store = configureStore({
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
        ignoredPaths: apiCachePaths,
      },
      immutableCheck: {
        ignoredPaths: apiCachePaths,
      },
    })
      .concat(api.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
