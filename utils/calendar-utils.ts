import { LocaleConfig } from "react-native-calendars";

export const setupCalendarLocale = (locale: string): void => {
  if (locale === "uk") {
    LocaleConfig.locales["uk"] = {
      monthNames: [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
      ],
      monthNamesShort: [
        "Січ.",
        "Лют.",
        "Бер.",
        "Квіт.",
        "Трав.",
        "Черв.",
        "Лип.",
        "Серп.",
        "Вер.",
        "Жовт.",
        "Лист.",
        "Груд.",
      ],
      dayNames: [
        "Неділя",
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четвер",
        "Пʼятниця",
        "Субота",
      ],
      dayNamesShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    };
    LocaleConfig.defaultLocale = "uk";
    return;
  }

  // Default to English explicitly when not Ukrainian
  LocaleConfig.defaultLocale = "en";
};

export const calendarTheme: Record<string, any> = {
  textDayHeaderFontWeight: "600",
  "stylesheet.calendar.main": {
    week: {
      marginVertical: 15,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
  "stylesheet.calendar.header": {
    header: {
      display: "none",
    },
    dayHeader: {
      color: "#292524",
      fontWeight: "500",
      marginBottom: 15,
    },
  },
};
