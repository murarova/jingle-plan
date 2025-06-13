import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { getConfigurationAsync, getUserDataAsync } from "../services/data-api";
import {
  CalendarConfig,
  DayData,
  DayTaskProgress,
  UserData,
  MonthPhotoData,
  PlanContextData,
  TextData,
  MoodTaskData,
  SummaryContextData,
  DayConfig,
} from "../types/types";
import { TASK_CATEGORY } from "../constants/constants";
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
    dayConfig: DayConfig
  ): DayTaskProgress => {
    if (!userData || !configuration)
      return { dayTaskGrade: 0, moodTaskGrade: 0 };

    if (!dayConfig) return { dayTaskGrade: 0, moodTaskGrade: 0 };

    let dayTaskGrade = 0;
    let moodTaskGrade = 0;

    // Check day task
    const { dayTaskConfig } = dayConfig;
    const monthPhotoData = userData[TASK_CATEGORY.MONTH_PHOTO] as
      | MonthPhotoData
      | undefined;
    const plansData = userData[TASK_CATEGORY.PLANS] as
      | PlanContextData
      | undefined;
    const summaryData = userData[TASK_CATEGORY.SUMMARY] as
      | SummaryContextData
      | undefined;
    const goalsData = userData[TASK_CATEGORY.GOALS] as TextData | null;
    const moodData = userData[TASK_CATEGORY.MOOD] as MoodTaskData | undefined;

    const context = dayTaskConfig.context as string;

    switch (dayTaskConfig.category) {
      case TASK_CATEGORY.MONTH_PHOTO:
        // For month photo, check if we have data for the specific month
        if (monthPhotoData && context in monthPhotoData) {
          dayTaskGrade = dayTaskConfig.grade;
        }
        break;

      case TASK_CATEGORY.PLANS:
        // For plans, check if we have any plans for the context
        if (
          plansData &&
          context in plansData &&
          plansData[context] &&
          plansData[context].length > 0
        ) {
          dayTaskGrade = dayTaskConfig.grade;
        }
        break;

      case TASK_CATEGORY.SUMMARY:
        // For summary, check if we have data for the specific context
        if (summaryData && context in summaryData && summaryData[context]) {
          dayTaskGrade = dayTaskConfig.grade;
        }
        break;

      case TASK_CATEGORY.GOALS:
        // For goals, check if we have any data
        if (goalsData) {
          dayTaskGrade = dayTaskConfig.grade;
        }
        break;
    }

    // Check mood task
    const { moodTaskConfig } = dayConfig;
    if (moodData && moodData[moment(dayNumber).format("DD")]) {
      moodTaskGrade = moodTaskConfig.grade;
    }

    return {
      dayTaskGrade,
      moodTaskGrade,
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
      progress: getTaskGrade(date, userData, dayConfig),
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
