import { LANGUAGES } from "../constants/constants";
import moment from "moment";
import {
  Calendar as NativeCalendar,
  LocaleConfig,
  DateData,
} from "react-native-calendars";
import { useTranslation } from "react-i18next";
import { getUserRole } from "../services/services";
import { useEffect, useState } from "react";
import { Pressable } from "@gluestack-ui/themed";
import { config } from "../config/gluestack-ui.config";
import CircularProgress from "react-native-circular-progress-indicator";
import { calculateTotalProgress } from "../utils/utils";
import { usePeriodOverviewScreenManager } from "../hooks/usePeriodOverviewScreenManager";

export function Calendar({
  pressHandler,
}: {
  pressHandler: (dateString: string) => void;
}) {
  // const currentDate = moment();
  const currentDate = moment("2024-12-14").format("YYYY-MM-DD");
  const { i18n } = useTranslation();
  const resolvedLanguage = i18n.resolvedLanguage as "ua";
  const locale = LANGUAGES[resolvedLanguage]?.moment === "uk" ? "uk" : "";
  const [isAdmin, setIsAdmin] = useState(false);
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
  LocaleConfig.defaultLocale = locale;

  const { getDayConfig, userData } = usePeriodOverviewScreenManager();

  useEffect(() => {
    getUserRole().then((role) => {
      if (role === "admin") {
        setIsAdmin(true);
      }
    });
  }, []);

  const minDate = moment("2024-01-01").format("YYYY-MM-DD");
  const maxDate = isAdmin
    ? moment("2024-12-31").format("YYYY-MM-DD")
    : currentDate;

  return (
    <NativeCalendar
      initialDate={minDate}
      firstDay={1}
      key={locale}
      hideExtraDays
      dayComponent={({ date, state }: { date: DateData; state: string }) => {
        const dayConfig = getDayConfig(date?.dateString);
        const progress = calculateTotalProgress(dayConfig?.progress);
        const today = date?.dateString === currentDate;
        return (
          <Pressable
            onPress={() => {
              if (state === "disabled") {
                return;
              }
              pressHandler(date?.dateString!);
            }}
          >
            {({ pressed }) => (
              <CircularProgress
                value={progress}
                activeStrokeColor={
                  pressed
                    ? config.tokens.colors.green500
                    : config.tokens.colors.green400
                }
                inActiveStrokeColor={config.tokens.colors.warmGray400}
                inActiveStrokeOpacity={0.2}
                circleBackgroundColor={
                  today
                    ? config.tokens.colors.green300
                    : pressed
                    ? config.tokens.colors.backgroundLight100
                    : "transparent"
                }
                showProgressValue={false}
                title={date?.day.toString()}
                activeStrokeWidth={state === "disabled" ? 0 : 5}
                inActiveStrokeWidth={state === "disabled" ? 0 : 5}
                titleStyle={{
                  fontSize: 16,
                  fontWeight: today ? 700 : 500,
                  color: today
                    ? config.tokens.colors.white
                    : state === "disabled"
                    ? config.tokens.colors.warmGray400
                    : "#292524",
                }}
                radius={25}
              />
            )}
          </Pressable>
        );
      }}
      hideArrows
      minDate={minDate}
      maxDate={maxDate}
      theme={{
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
            fontWeight: 500,
            marginBottom: 15,
          },
        },
      }}
    />
  );
}
