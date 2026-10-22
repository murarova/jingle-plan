import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// RTK Query now handles all data operations
// This reducer only manages local app state
import { CalendarConfig } from "@/types";
import { YEARS } from "@/constants";

export type RequestStatus = "idle" | "pending" | "succeeded" | "failed";

export interface AppState {
  configuration: CalendarConfig | null;
  selectedYear: string;
  availableYears: string[];
  status: RequestStatus;
  error: string | null;
}

const initialState: AppState = {
  configuration: null,
  selectedYear: YEARS[YEARS.length - 1],
  availableYears: [YEARS[YEARS.length - 1]],
  status: "idle",
  error: null,
};

// All data operations are now handled by RTK Query
// This reducer only manages local app state

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    setAvailableYears: (state, action: PayloadAction<string[]>) => {
      state.availableYears = action.payload;
    },
    setConfiguration: (state, action: PayloadAction<CalendarConfig | null>) => {
      state.configuration = action.payload;
    },
  },
});

export const { setSelectedYear, setAvailableYears, setConfiguration } =
  appSlice.actions;
export const selectSelectedYear = (state: { app: AppState }) =>
  state.app.selectedYear;
export const selectAvailableYears = (state: { app: AppState }) =>
  state.app.availableYears;

export default appSlice.reducer;
