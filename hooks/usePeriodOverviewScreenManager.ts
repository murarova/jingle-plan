import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { getConfigurationAsync, getUserDataAsync } from "../services/data-api";
import {
  CalendarConfig,
  DayData,
  DayTaskProgress,
  UserData,
} from "../types/types";
import moment from "moment";

export const usePeriodOverviewScreenManager = () => {
  const dispatch = useAppDispatch();
  const { configuration, userData, status, error } = useAppSelector(
    (state) => state.app
  );
  const { currentUser } = useAppSelector((state) => state.auth);
  const isLoading = status === "pending";

  useEffect(() => {
    if (currentUser && !userData && !configuration && status !== "pending") {
      dispatch(getUserDataAsync());
      dispatch(getConfigurationAsync());
    }
  }, [status, userData, configuration, currentUser]);

  const getTaskGrade = (
    dayNumber: string,
    userData: UserData | null,
    configuration: CalendarConfig | null,
    language: string
  ): DayTaskProgress => {
    if (!userData || !configuration)
      return { dayTaskGrade: 0, moodTaskGrade: 0 };

    const dayConfig = configuration[dayNumber]?.[language as "ua" | "en"];
    if (!dayConfig) return { dayTaskGrade: 0, moodTaskGrade: 0 };

    const isDayTaskCompleted = userData?.complited?.includes(dayNumber);

    return {
      dayTaskGrade: isDayTaskCompleted ? dayConfig.dayTaskConfig.grade : 0,
      moodTaskGrade: isDayTaskCompleted ? dayConfig.moodTaskConfig.grade : 0,
    };
  };

  const getDayConfig = (
    date: string,
    language: string = "ua"
  ): DayData | null => {
    if (!configuration) return null;

    const dayNumber = moment(date).format("DD");
    const dayConfig = configuration[dayNumber]?.[language as "ua" | "en"];

    if (!dayConfig) return null;

    return {
      day: date,
      progress: getTaskGrade(date, userData, configuration, language),
      config: dayConfig,
    };
  };

  return {
    isLoading,
    error,
    configuration,
    userData,
    getDayConfig,
  };
};
