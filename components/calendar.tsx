import { LANGUAGES } from "../constants/constants";
import moment from "moment";
import { Calendar as NativeCalendar, DateData } from "react-native-calendars";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

import { memo, useCallback, useEffect, useMemo } from "react";
import { Pressable, Box, View } from "@gluestack-ui/themed";
import { config } from "../config/gluestack-ui.config";
import CircularProgress from "react-native-circular-progress-indicator";
import { calculateTotalProgress } from "../utils/utils";
import { useCalendarDayManager } from "../hooks/useCalendarDayManager";
import { useAppSelector } from "../store/withTypes";
import { selectSelectedYear } from "../store/appReducer";
import { calendarTheme, setupCalendarLocale } from "../utils/calendar-utils";
import { useGetUserDataQuery } from "../services/api";

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

    const handlePress = useCallback(async () => {
      if (disabled) return;

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }

      onPress(date?.dateString!);
    }, [disabled, date?.dateString, onPress]);

    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Box alignItems="center" justifyContent="center" position="relative">
            <CircularProgress
              value={progress}
              activeStrokeColor={
                progress === 0 ? "transparent" : config.tokens.colors.green400
              }
              inActiveStrokeColor={
                disabled
                  ? config.tokens.colors.warmGray300
                  : config.tokens.colors.warmGray400
              }
              inActiveStrokeOpacity={0.2}
              circleBackgroundColor={
                disabled
                  ? config.tokens.colors.warmGray200
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
                color: disabled ? config.tokens.colors.warmGray400 : "#292524",
              }}
              radius={25}
            />
            {today && (
              <Box
                position="absolute"
                top={-12}
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={config.tokens.colors.primary500}
              />
            )}
          </Box>
        )}
      </Pressable>
    );
  }
);

DayComponent.displayName = "DayComponent";

export const Calendar = memo(({ pressHandler }: CalendarProps) => {
  const selectedYear = useAppSelector(selectSelectedYear);
  const currentDate = moment(`${selectedYear}-12-14`).format("YYYY-MM-DD");
  const { i18n, t } = useTranslation();
  const resolvedLanguage =
    (i18n.resolvedLanguage as keyof typeof LANGUAGES) || "en";
  const { currentUser } = useAppSelector((state) => state.auth);

  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear }
  );

  const isAdmin = userData?.userProfile?.isAdmin || false;

  const locale = useMemo(
    () => (LANGUAGES[resolvedLanguage]?.moment === "uk" ? "uk" : ""),
    [resolvedLanguage]
  );

  const { getDayConfig } = useCalendarDayManager();

  useEffect(() => {
    setupCalendarLocale(locale);
  }, [locale]);

  const minDate = useMemo(
    () => moment(`${selectedYear}-12-01`).format("YYYY-MM-DD"),
    [selectedYear]
  );

  const maxDate = useMemo(
    () =>
      isAdmin
        ? moment(`${selectedYear}-12-31`).format("YYYY-MM-DD")
        : currentDate,
    [isAdmin, currentDate, selectedYear]
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
          progress={progress ?? 0}
        />
      );
    },
    [getDayConfig, pressHandler, currentDate]
  );

  return (
    <Box position="relative">
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
