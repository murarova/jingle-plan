import { Box } from "@/ui/box";
import moment from "moment";
import { Calendar as NativeCalendar, DateData } from "react-native-calendars";
import { memo, useCallback, useMemo } from "react";
import { calculateTotalProgress } from "@/utils";
import { useAppSelector } from "../../store/withTypes";
import { selectSelectedYear } from "../../store/appReducer";
import { calendarTheme, setupCalendarLocale } from "../../utils/calendar-utils";
import { DayComponent } from "./day-component";
import { useIAP } from "../../hooks/useIAP";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "@/constants";

interface CalendarProps {
  pressHandler: (dateString: string) => void;
  getDayConfig: ReturnType<
    (typeof import("../../hooks/useCalendarDayManager"))["useCalendarDayManager"]
  >["getDayConfig"];
  isAdmin: boolean;
  isLoading: boolean;
  currentYear: string;
  currentDate: string;
}

export const Calendar = memo(
  ({
    pressHandler,
    getDayConfig,
    isAdmin,
    isLoading,
    currentYear,
    currentDate,
  }: CalendarProps) => {
    const selectedYear = useAppSelector(selectSelectedYear);
    const navigation = useNavigation();
    const { isSubscriber } = useIAP();
    const locale = "uk";
    // const currentDate = "2026-12-01";

    setupCalendarLocale(locale);

    const minDate = useMemo(
      () => moment(`${selectedYear}-12-01`).format("YYYY-MM-DD"),
      [selectedYear],
    );

    const firstUnlockedDate = useMemo(
      () => moment(`${currentYear}-12-03`).format("YYYY-MM-DD"),
      [currentYear],
    );

    const baseMaxDate = useMemo(() => {
      const today = moment(currentDate, "YYYY-MM-DD");
      const thirdDay = moment(firstUnlockedDate, "YYYY-MM-DD");
      if (!isSubscriber) {
        return thirdDay.format("YYYY-MM-DD");
      }
      return moment.max(today, thirdDay).format("YYYY-MM-DD");
    }, [currentDate, firstUnlockedDate, isSubscriber]);

    const maxDate = useMemo(
      () =>
        isAdmin
          ? moment(`${selectedYear}-12-31`).format("YYYY-MM-DD")
          : baseMaxDate,
      [isAdmin, baseMaxDate, selectedYear],
    );

    const renderDayComponent = useCallback(
      ({ date, state }: { date?: DateData; state?: string }) => {
        if (!date?.dateString) return null;
        const dayConfig = getDayConfig(date.dateString);
        const progress = calculateTotalProgress(dayConfig?.progress);

        return (
          <DayComponent
            date={date}
            maxDate={maxDate}
            isAdmin={isAdmin}
            state={state ?? ""}
            onPress={pressHandler}
            currentDate={currentDate}
            progress={progress ?? 0}
            isLoading={isLoading}
            isSubscriber={isSubscriber}
            navigateToPaywall={() =>
              navigation.navigate(SCREENS.PAYWALL as never)
            }
          />
        );
      },
      [
        getDayConfig,
        pressHandler,
        currentDate,
        isSubscriber,
        navigation,
        selectedYear,
        maxDate,
        isAdmin,
        isLoading,
      ],
    );

    return (
      <Box className="relative">
        <NativeCalendar
          initialDate={minDate}
          firstDay={1}
          key={`${locale}-${selectedYear}`}
          hideExtraDays
          dayComponent={renderDayComponent}
          hideArrows
          minDate={minDate}
          maxDate={maxDate}
          theme={calendarTheme as any}
          testID="advent-calendar"
        />
      </Box>
    );
  },
);

Calendar.displayName = "Calendar";
