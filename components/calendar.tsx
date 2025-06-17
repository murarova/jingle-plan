import { LANGUAGES, YEAR } from "../constants/constants";
import moment from "moment";
import { Calendar as NativeCalendar, DateData } from "react-native-calendars";
import { useTranslation } from "react-i18next";

import { memo, useCallback, useEffect, useMemo } from "react";
import { Pressable, Box } from "@gluestack-ui/themed";
import { config } from "../config/gluestack-ui.config";
import CircularProgress from "react-native-circular-progress-indicator";
import { calculateTotalProgress } from "../utils/utils";
import { useCalendarDayManager } from "../hooks/useCalendarDayManager";
import { useAppSelector } from "../store/withTypes";
import { Loader } from "./common";
import { calendarTheme, setupCalendarLocale } from "../utils/calendar-utils";

interface CalendarProps {
  pressHandler: (dateString: string) => void;
}

interface DayComponentProps {
  date: DateData;
  state: string;
  onPress: (dateString: string) => void;
  currentDate: string;
  progress: number;
}

const DayComponent = memo(
  ({ date, state, onPress, currentDate, progress }: DayComponentProps) => {
    const today = date?.dateString === currentDate;
    const disabled = state === "disabled";

    const handlePress = useCallback(() => {
      if (disabled) return;
      onPress(date?.dateString!);
    }, [disabled, date?.dateString, onPress]);

    return (
      <Pressable onPress={handlePress}>
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
            title={date?.day?.toString() || ""}
            activeStrokeWidth={disabled ? 0 : 5}
            inActiveStrokeWidth={disabled ? 0 : 5}
            titleStyle={{
              fontSize: 16,
              fontWeight: today ? 700 : 500,
              color: today
                ? config.tokens.colors.white
                : disabled
                ? config.tokens.colors.warmGray400
                : "#292524",
            }}
            radius={25}
          />
        )}
      </Pressable>
    );
  }
);

DayComponent.displayName = "DayComponent";

export const Calendar = memo(({ pressHandler }: CalendarProps) => {
  const currentDate = moment(`${YEAR}-12-14`).format("YYYY-MM-DD");
  const { i18n, t } = useTranslation();
  const resolvedLanguage =
    (i18n.resolvedLanguage as keyof typeof LANGUAGES) || "en";
  const { status, userData } = useAppSelector((state) => state.app);
  const isAdmin = userData?.userProfile.isAdmin || false;

  const locale = useMemo(
    () => (LANGUAGES[resolvedLanguage]?.moment === "uk" ? "uk" : ""),
    [resolvedLanguage]
  );

  const { getDayConfig } = useCalendarDayManager();
  const isLoading = status === "pending";

  useEffect(() => {
    setupCalendarLocale(locale);
  }, [locale]);

  const minDate = useMemo(
    () => moment(`${YEAR}-01-01`).format("YYYY-MM-DD"),
    []
  );

  const maxDate = useMemo(
    () =>
      isAdmin ? moment(`${YEAR}-12-31`).format("YYYY-MM-DD") : currentDate,
    [isAdmin, currentDate]
  );

  const renderDayComponent = useCallback(
    ({ date, state }: { date: DateData; state: string }) => {
      if (!date?.dateString) return null;

      const dayConfig = getDayConfig(date.dateString);
      const progress = calculateTotalProgress(dayConfig?.progress);

      return (
        <DayComponent
          date={date}
          state={state}
          onPress={pressHandler}
          currentDate={currentDate}
          progress={progress}
        />
      );
    },
    [getDayConfig, pressHandler, currentDate]
  );

  return (
    <Box position="relative">
      {isLoading && <Loader absolute />}
      <NativeCalendar
        initialDate={minDate}
        firstDay={1}
        key={locale}
        hideExtraDays
        dayComponent={renderDayComponent}
        hideArrows
        minDate={minDate}
        maxDate={maxDate}
        theme={calendarTheme}
        testID="advent-calendar"
      />
    </Box>
  );
});

Calendar.displayName = "Calendar";
