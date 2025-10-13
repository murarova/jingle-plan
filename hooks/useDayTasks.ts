import { useMemo } from "react";
import { useCalendarDayManager } from "./useCalendarDayManager";
import { calculateTotalProgress } from "../utils/utils";

export const useDayTasks = (currentDay: string) => {
  const { getDayConfig, error, refresh, isLoading } = useCalendarDayManager();

  const dayTasks = getDayConfig(currentDay);
  const total = useMemo(
    () => (dayTasks ? calculateTotalProgress(dayTasks.progress) : 0),
    [dayTasks]
  );

  return {
    dayTasks,
    total,
    error,
    refresh,
    isLoading,
  };
};
