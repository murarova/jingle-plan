import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import { api } from "../services/api";
import { authApi } from "../services/auth-api-rtk";
import { createLogger } from "redux-logger";

const logger = createLogger({
  collapsed: true,
  titleFormatter: (action) => {
    const isApiAction =
      typeof action.type === "string" &&
      (action.type.startsWith(api.reducerPath) ||
        action.type.startsWith(authApi.reducerPath));

    if (!isApiAction) return action.type as string;

    const endpoint = action.meta?.arg?.endpointName;
    const cacheKey = action.meta?.arg?.queryCacheKey;
    const originalArgs = action.meta?.arg?.originalArgs;
    const argsPreview = originalArgs
      ? ` args=${JSON.stringify(originalArgs).slice(0, 200)}`
      : "";
    const suffix = [endpoint, cacheKey].filter(Boolean).join(" · ");
    return suffix
      ? `${action.type} → ${suffix}${argsPreview}`
      : `${action.type}${argsPreview}`;
  },
});

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
      },
    })
      .concat(api.middleware)
      .concat(authApi.middleware)
      .concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
