import { useCallback, useMemo } from "react";
import { useAppSelector } from "../store/withTypes";
import {
  useGetConfigurationQuery,
  useGetUserDataQuery,
  useGetUserProfileQuery,
} from "../services/api";
import {
  DayData,
  DayTaskProgress,
  UserData,
  MonthPhotoData,
  PlanContextData,
  MoodTaskData,
  SummaryContextData,
  DayConfig,
  GoalsData,
} from "../types/types";
import { TASK_CATEGORY } from "../constants/constants";

export const useCalendarDayManager = () => {
  const { selectedYear } = useAppSelector((state) => state.app);
  const { currentUser } = useAppSelector((state) => state.auth);

  const {
    data: configuration,
    isLoading: isConfigLoading,
    error: configError,
  } = useGetConfigurationQuery(
    { year: selectedYear },
    {
      skip: !selectedYear,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: userDataError,
    refetch: refetchUserData,
  } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    {
      skip: !currentUser?.uid || !selectedYear,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { data: userProfile } = useGetUserProfileQuery(
    { uid: currentUser?.uid! },
    {
      skip: !currentUser?.uid,
    }
  );

  const isLoading = isConfigLoading || isUserDataLoading;
  const error = configError || userDataError;
  const isAdmin = userProfile?.role === "admin" || false;

  const refresh = useCallback(() => {
    return refetchUserData();
  }, [refetchUserData]);

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
          const goalsData = userData[TASK_CATEGORY.GOALS] as GoalsData | null;
          if (!goalsData) return 0;
          const goalEntry = goalsData[context as keyof GoalsData];
          return goalEntry ? grade : 0;
        }

        default:
          return 0;
      }
    },
    []
  );

  const calculateMoodTaskGrade = useCallback(
    (
      dayKey: string, // expects "DD"
      moodTaskConfig: { grade: number },
      userData: UserData | null
    ): number => {
      if (!userData) return 0;

      const moodData = userData[TASK_CATEGORY.MOOD] as MoodTaskData | undefined;
      return moodData && moodData[dayKey] ? moodTaskConfig.grade : 0;
    },
    []
  );

  const getTaskGrade = useCallback(
    (
      dateString: string,
      userData: UserData | null,
      dayConfig: DayConfig
    ): DayTaskProgress => {
      if (!userData || !configuration || !dayConfig) {
        return { dayTaskGrade: 0, moodTaskGrade: 0 };
      }

      const { dayTaskConfig, moodTaskConfig } = dayConfig;
      const context = dayTaskConfig.context as string;
      const dayKey = dateString.substring(8, 10); // "DD"

      const dayTaskGrade = calculateTaskGradeByCategory(
        dayTaskConfig.category,
        context,
        dayTaskConfig.grade,
        userData
      );

      const moodTaskGrade = calculateMoodTaskGrade(
        dayKey,
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

      const dayKey = date.substring(8, 10); // "DD"
      const dayConfig = configuration[dayKey]?.[language];

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
    refresh,
    hasData,
    shouldRetry,
    isAdmin,
  };
};
