import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { getConfigurationAsync, getUserDataAsync } from "../services/data-api";
import {
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

// Cache to prevent duplicate fetches across StrictMode remounts
const fetchedKeys = new Set<string>();

export const useCalendarDayManager = () => {
  const dispatch = useAppDispatch();
  const { configuration, userData, status, error, selectedYear } =
    useAppSelector((state) => state.app);
  const { currentUser } = useAppSelector((state) => state.auth);
  const isLoading = status === "pending";
  const lastFetchedKey = useRef<string | null>(null);

  const refresh = useCallback(() => {
    dispatch(getUserDataAsync());
    dispatch(getConfigurationAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchKey = currentUser ? `${currentUser.uid}:${selectedYear}` : null;
    if (!fetchKey) return;

    if (lastFetchedKey.current !== fetchKey && !fetchedKeys.has(fetchKey)) {
      lastFetchedKey.current = fetchKey;
      fetchedKeys.add(fetchKey);
      dispatch(getUserDataAsync());
      dispatch(getConfigurationAsync());
    }
  }, [currentUser, selectedYear, dispatch]);

  const calculateTaskGradeByCategory = useCallback(
    (
      category: string,
      context: string,
      grade: number,
      userData: UserData | null
    ): number => {
      if (!userData) return 0;

      switch (category) {
        case TASK_CATEGORY.MONTH_PHOTO: {
          const monthPhotoData = userData[TASK_CATEGORY.MONTH_PHOTO] as
            | MonthPhotoData
            | undefined;
          return monthPhotoData && context in monthPhotoData ? grade : 0;
        }

        case TASK_CATEGORY.PLANS: {
          const plansData = userData[TASK_CATEGORY.PLANS] as
            | PlanContextData
            | undefined;

          if (!plansData) return 0;
          if (!(context in plansData)) return 0;

          const contextPlans = plansData[context];
          if (!contextPlans || contextPlans.length === 0) return 0;

          return grade;
        }

        case TASK_CATEGORY.SUMMARY: {
          const summaryData = userData[TASK_CATEGORY.SUMMARY] as
            | SummaryContextData
            | undefined;
          return summaryData && context in summaryData && summaryData[context]
            ? grade
            : 0;
        }

        case TASK_CATEGORY.GOALS: {
          const goalsData = userData[TASK_CATEGORY.GOALS] as TextData | null;
          return goalsData ? grade : 0;
        }

        default:
          return 0;
      }
    },
    []
  );

  const calculateMoodTaskGrade = useCallback(
    (
      dayNumber: string,
      moodTaskConfig: { grade: number },
      userData: UserData | null
    ): number => {
      if (!userData) return 0;

      const moodData = userData[TASK_CATEGORY.MOOD] as MoodTaskData | undefined;
      return moodData && moodData[moment(dayNumber).format("DD")]
        ? moodTaskConfig.grade
        : 0;
    },
    []
  );

  const getTaskGrade = useCallback(
    (
      dayNumber: string,
      userData: UserData | null,
      dayConfig: DayConfig
    ): DayTaskProgress => {
      if (!userData || !configuration || !dayConfig) {
        return { dayTaskGrade: 0, moodTaskGrade: 0 };
      }

      const { dayTaskConfig, moodTaskConfig } = dayConfig;
      const context = dayTaskConfig.context as string;

      const dayTaskGrade = calculateTaskGradeByCategory(
        dayTaskConfig.category,
        context,
        dayTaskConfig.grade,
        userData
      );

      const moodTaskGrade = calculateMoodTaskGrade(
        dayNumber,
        moodTaskConfig,
        userData
      );

      return {
        dayTaskGrade,
        moodTaskGrade,
      };
    },
    [configuration, calculateTaskGradeByCategory, calculateMoodTaskGrade]
  );

  const getDayConfig = useCallback(
    (date: string, language: "ua" | "en" = "ua"): DayData | null => {
      if (!configuration) return null;

      const dayNumber = moment(date).format("DD");
      const dayConfig = configuration[dayNumber]?.[language];

      if (!dayConfig) return null;

      return {
        day: date,
        progress: getTaskGrade(date, userData, dayConfig),
        config: dayConfig,
      };
    },
    [configuration, userData, getTaskGrade, selectedYear]
  );

  const hasData = useMemo(
    () => Boolean(configuration && userData),
    [configuration, userData, selectedYear]
  );
  const shouldRetry = useMemo(
    () => Boolean(error && !isLoading),
    [error, isLoading]
  );

  return {
    isLoading,
    error,
    configuration,
    userData,
    getDayConfig,
    status,
    refresh,
    hasData,
    shouldRetry,
  };
};
