import { LocaleConfig } from "react-native-calendars";
import { colors } from "@/constants/colors";
import { systemFontFamily, secondaryFontSize } from "@/constants/typography";

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
  calendarBackground: "transparent",
  backgroundColor: "transparent",
  textSectionTitleColor: colors.secondaryText,
  textDayHeaderFontWeight: "500",
  textDayHeaderFontSize: 14,
  "stylesheet.calendar.main": {
    container: {
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: "transparent",
    },
    week: {
      marginTop: 0,
      marginBottom: 28,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
  "stylesheet.calendar.header": {
    header: {
      height: 0,
      opacity: 0,
    },
    week: {
      marginTop: 0,
      marginBottom: 28,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    dayHeader: {
      width: 41,
      textAlign: "center",
      color: colors.secondaryText,
      fontWeight: "400",
      fontSize: secondaryFontSize,
      fontFamily: systemFontFamily,
      marginBottom: 0,
      includeFontPadding: false,
    },
  },
};
