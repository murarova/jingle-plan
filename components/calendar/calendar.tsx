import moment from "moment";
import { Calendar as NativeCalendar, DateData } from "react-native-calendars";
import { memo, useCallback, useMemo } from "react";
import { Box } from "@gluestack-ui/themed";
import { calculateTotalProgress } from "../../utils/utils";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { useAppSelector } from "../../store/withTypes";
import { selectSelectedYear } from "../../store/appReducer";
import { calendarTheme, setupCalendarLocale } from "../../utils/calendar-utils";
import { DayComponent } from "./day-component";

interface CalendarProps {
  pressHandler: (dateString: string) => void;
}

export const Calendar = memo(({ pressHandler }: CalendarProps) => {
  const selectedYear = useAppSelector(selectSelectedYear);
  const currentDate = moment().format("YYYY-MM-DD");
  // const { i18n } = useTranslation();
  // const resolvedLanguage =
  //   (i18n.resolvedLanguage as keyof typeof LANGUAGES) || "en";

  const locale = "uk";

  setupCalendarLocale(locale);
  const { getDayConfig, isAdmin } = useCalendarDayManager();

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
        key={`${locale}-${selectedYear}`}
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
