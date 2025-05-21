import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { enumerateDaysBetweenDates } from "../utils/utils";
import { START_DAY, END_DAY } from "../constants/constants";
import i18n from "../i18n/i18n";
import { getConfigurationAsync, getUserDataAsync } from "../services/data-api";

export const usePeriodOverviewScreenManager = () => {
  const dispatch = useAppDispatch();
  const { configuration, userData, status, error } = useAppSelector(
    (state) => state.app
  );
  const { currentUser } = useAppSelector((state) => state.auth);
  const isLoading = status === "pending";

  useEffect(() => {
    // Only fetch if we don't have the data and haven't tried loading yet
    if (currentUser && !userData && !configuration && status !== "pending") {
      dispatch(getUserDataAsync());
      dispatch(getConfigurationAsync());
    }
  }, [status, userData, configuration, currentUser]);

  const getDayConfig = (date: string) => {
    if (!userData || !configuration) return null;

    const days = enumerateDaysBetweenDates(
      userData,
      configuration,
      i18n.resolvedLanguage!,
      START_DAY,
      END_DAY
    );

    return days.find(({ day }) => day === date);
  };

  return {
    isLoading,
    error,
    configuration,
    userData,
    getDayConfig,
  };
};
