import { getActiveRouteName } from "../../navigation/active-route";

describe("getActiveRouteName", () => {
  it("returns null for an empty state", () => {
    expect(getActiveRouteName(undefined)).toBeNull();
  });

  it("returns the top-level route when there is no nested state", () => {
    expect(
      getActiveRouteName({
        index: 1,
        routes: [{ name: "Loading" }, { name: "Paywall" }],
      } as never),
    ).toBe("Paywall");
  });

  it("resolves the deepest focused route", () => {
    expect(
      getActiveRouteName({
        index: 0,
        routes: [
          {
            name: "Home",
            state: {
              index: 0,
              routes: [
                {
                  name: "PeriodOverview",
                  state: {
                    index: 1,
                    routes: [{ name: "PeriodOverviewMain" }, { name: "DayOverview" }],
                  },
                },
              ],
            },
          },
        ],
      } as never),
    ).toBe("DayOverview");
  });
});
