import { useMemo } from "react";
import { useAppSelector } from "../store/withTypes";
import { PlanContextData } from "../types/types";
import {
  calculateContextData,
  calculateTotalData,
  isDataEmpty as checkDataEmpty,
} from "../utils/dashboard-utils";

// Create a custom hook for dashboard data
export const useDashboardData = () => {
  const { userData, status } = useAppSelector((state) => state.app);
  const plans = userData?.plans as PlanContextData | null;

  const totalData = useMemo(
    () => (plans ? calculateTotalData(plans) : null),
    [plans]
  );

  const contextData = useMemo(
    () => (plans ? calculateContextData(plans) : null),
    [plans]
  );

  const isEmpty = useMemo(() => checkDataEmpty(totalData), [totalData]);

  return {
    totalData,
    contextData,
    isEmpty,
    status,
  };
};
