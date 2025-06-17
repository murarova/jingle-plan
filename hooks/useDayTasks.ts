import { useMemo } from "react";
import { useCalendarDayManager } from "./useCalendarDayManager";
import { calculateTotalProgress } from "../utils/utils";

export const useDayTasks = (currentDay: string) => {
  const { getDayConfig, status, error, refresh } = useCalendarDayManager();

  const dayTasks = getDayConfig(currentDay);
  const total = useMemo(
    () => (dayTasks ? calculateTotalProgress(dayTasks.progress) : 0),
    [dayTasks]
  );

  return {
    dayTasks,
    total,
    status,
    error,
    refresh,
  };
};
