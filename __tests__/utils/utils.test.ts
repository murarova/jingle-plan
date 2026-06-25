import {
  getProgressColorByValue,
  calculateTotalProgress,
  getPluralForm,
  resolveErrorMessage,
} from "../../utils/utils";

describe("getProgressColorByValue", () => {
  it("returns red below 30", () => {
    expect(getProgressColorByValue(0)).toBe("$progressRed");
    expect(getProgressColorByValue(29)).toBe("$progressRed");
  });

  it("returns yellow between 30 and 69", () => {
    expect(getProgressColorByValue(30)).toBe("$progressYellow");
    expect(getProgressColorByValue(69)).toBe("$progressYellow");
  });

  it("returns green at 70 and above", () => {
    expect(getProgressColorByValue(70)).toBe("$green400");
    expect(getProgressColorByValue(100)).toBe("$green400");
  });
});

describe("calculateTotalProgress", () => {
  it("returns 0 when progress is undefined", () => {
    expect(calculateTotalProgress()).toBe(0);
  });

  it("sums the task grades", () => {
    expect(
      calculateTotalProgress({ dayTaskGrade: 40, moodTaskGrade: 35 })
    ).toBe(75);
  });

  it("handles zeroed progress", () => {
    expect(
      calculateTotalProgress({ dayTaskGrade: 0, moodTaskGrade: 0 })
    ).toBe(0);
  });
});

describe("getPluralForm", () => {
  const ukDictionary: Record<string, string> = {
    "screens.dashboardScreen.tasksSingular": "ціль",
    "screens.dashboardScreen.tasksFew": "цілі",
    "screens.dashboardScreen.tasksPlural": "цілей",
  };
  const enDictionary: Record<string, string> = {
    "screens.dashboardScreen.tasksSingular": "goal",
    "screens.dashboardScreen.tasksFew": "goals",
    "screens.dashboardScreen.tasksPlural": "goals",
  };
  const uk = (key: string) => ukDictionary[key];
  const en = (key: string) => enDictionary[key];

  it("applies Ukrainian rules", () => {
    expect(getPluralForm(1, uk)).toBe("ціль");
    expect(getPluralForm(2, uk)).toBe("цілі");
    expect(getPluralForm(4, uk)).toBe("цілі");
    expect(getPluralForm(5, uk)).toBe("цілей");
    expect(getPluralForm(11, uk)).toBe("цілей");
    expect(getPluralForm(19, uk)).toBe("цілей");
    expect(getPluralForm(21, uk)).toBe("ціль");
    expect(getPluralForm(0, uk)).toBe("цілей");
  });

  it("applies English rules", () => {
    expect(getPluralForm(1, en)).toBe("goal");
    expect(getPluralForm(0, en)).toBe("goals");
    expect(getPluralForm(2, en)).toBe("goals");
  });
});

describe("resolveErrorMessage", () => {
  it("returns a plain string error", () => {
    expect(resolveErrorMessage("boom")).toBe("boom");
  });

  it("returns the message of an Error instance", () => {
    expect(resolveErrorMessage(new Error("failed"))).toBe("failed");
  });

  it("reads a string data field (RTK style)", () => {
    expect(resolveErrorMessage({ data: "server error" })).toBe("server error");
  });

  it("reads a nested data.message field", () => {
    expect(
      resolveErrorMessage({ data: { message: "nested error" } })
    ).toBe("nested error");
  });

  it("returns null for unrecognized shapes", () => {
    expect(resolveErrorMessage(undefined)).toBeNull();
    expect(resolveErrorMessage({ foo: "bar" })).toBeNull();
  });
});
