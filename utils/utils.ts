interface TaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

export function getProgressColorByValue(value: number): string {
  if (value < 30) {
    return "$progressRed";
  } else if (value >= 30 && value < 70) {
    return "$progressYellow";
  } else {
    return "$green400";
  }
}

export function calculateTotalProgress(progress?: TaskProgress): number {
  if (!progress) {
    return 0;
  }
  const totalProgress = Object.values(progress).reduce((sum, grade) => {
    return sum + grade;
  }, 0);

  return totalProgress;
}

// Helper function for pluralization (Ukrainian and English)
export const getPluralForm = (count: number, t: any) => {
  // Detect language by checking what the translation function returns
  const testTranslation = t("screens.dashboardScreen.tasksSingular");
  const isUkrainian = testTranslation === "ціль";

  if (isUkrainian) {
    // Ukrainian pluralization rules
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return t("screens.dashboardScreen.tasksPlural"); // 11-19: цілей
    }

    if (lastDigit === 1) {
      return t("screens.dashboardScreen.tasksSingular"); // 1: ціль
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("screens.dashboardScreen.tasksFew"); // 2-4: цілі
    }

    return t("screens.dashboardScreen.tasksPlural"); // 0, 5-9: цілей
  } else {
    // English pluralization rules
    if (count === 1) {
      return t("screens.dashboardScreen.tasksSingular"); // 1: goal
    } else {
      return t("screens.dashboardScreen.tasksPlural"); // 0, 2+: goals
    }
  }
};

export const resolveErrorMessage = (error: unknown): string | null => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;

      if (typeof message === "string") {
        return message;
      }
    }
  }

  return null;
};
