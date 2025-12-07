import { useState, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import moment from "moment";

export function useCurrentDate(): [string, () => void] {
  const [currentDate, setCurrentDate] = useState(() =>
    moment().format("YYYY-MM-DD")
  );

  const updateDate = useCallback(() => {
    setCurrentDate(moment().format("YYYY-MM-DD"));
  }, []);

  useEffect(() => {
    updateDate();
  }, [updateDate]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          updateDate();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [updateDate]);

  return [currentDate, updateDate];
}
