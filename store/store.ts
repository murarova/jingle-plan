import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
