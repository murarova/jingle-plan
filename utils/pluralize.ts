export const getPluralForm = (count: number, t: any) => {
  const testTranslation = t("screens.dashboardScreen.tasksSingular");
  const isUkrainian = testTranslation === "ціль";

  if (isUkrainian) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return t("screens.dashboardScreen.tasksPlural");
    }

    if (lastDigit === 1) {
      return t("screens.dashboardScreen.tasksSingular");
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return t("screens.dashboardScreen.tasksFew");
    }

    return t("screens.dashboardScreen.tasksPlural");
  }

  if (count === 1) {
    return t("screens.dashboardScreen.tasksSingular");
  }

  return t("screens.dashboardScreen.tasksPlural");
};
