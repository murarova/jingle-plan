import appReducer, {
  setSelectedYear,
  setConfiguration,
  selectSelectedYear,
} from "../../store/appReducer";
import { YEARS } from "../../constants/constants";
import type { CalendarConfig } from "../../types/types";

const initialState = appReducer(undefined, { type: "@@INIT" });

describe("appReducer", () => {
  it("defaults the selected year to the latest configured year", () => {
    expect(initialState.selectedYear).toBe(YEARS[YEARS.length - 1]);
    expect(initialState.configuration).toBeNull();
    expect(initialState.status).toBe("idle");
  });

  it("updates the selected year", () => {
    const state = appReducer(initialState, setSelectedYear("2024"));
    expect(state.selectedYear).toBe("2024");
  });

  it("stores the configuration", () => {
    const config = { foo: "bar" } as unknown as CalendarConfig;
    const state = appReducer(initialState, setConfiguration(config));
    expect(state.configuration).toBe(config);
  });

  it("clears the configuration when set to null", () => {
    const withConfig = appReducer(
      initialState,
      setConfiguration({ foo: "bar" } as unknown as CalendarConfig)
    );
    const state = appReducer(withConfig, setConfiguration(null));
    expect(state.configuration).toBeNull();
  });

  it("selectSelectedYear reads the slice", () => {
    expect(selectSelectedYear({ app: initialState })).toBe(
      YEARS[YEARS.length - 1]
    );
  });
});
