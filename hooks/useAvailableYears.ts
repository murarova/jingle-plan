import { useEffect, useRef } from "react";
import { YEARS } from "@/constants";
import { useLazyGetUserDataQuery } from "../services/api";
import {
  setAvailableYears,
  selectAvailableYears,
} from "../store/appReducer";
import { useAppDispatch, useAppSelector } from "../store/withTypes";

export function useAvailableYears() {
  const dispatch = useAppDispatch();
  const availableYears = useAppSelector(selectAvailableYears);
  const userUid = useAppSelector((state) => state.auth.userUid);
  const currentYear = YEARS[YEARS.length - 1];
  const loadedUidRef = useRef<string | null>(null);
  const [fetchUserYearData] = useLazyGetUserDataQuery();

  useEffect(() => {
    if (!userUid) {
      if (loadedUidRef.current) {
        loadedUidRef.current = null;
        dispatch(setAvailableYears([currentYear]));
      }
      return;
    }

    if (loadedUidRef.current === userUid) {
      return;
    }

    let isActive = true;

    const loadYears = async (uid: string) => {
      const yearsWithData = new Set<string>();

      for (const year of YEARS) {
        if (year === currentYear) continue;
        try {
          const request = fetchUserYearData({ uid, year }, true);
          const data = await request.unwrap();
          if (data) {
            yearsWithData.add(year);
          }
        } catch {}
      }

      if (!isActive) return;

      loadedUidRef.current = uid;
      dispatch(
        setAvailableYears(
          YEARS.filter(
            (year) => year === currentYear || yearsWithData.has(year),
          ),
        ),
      );
    };

    void loadYears(userUid);

    return () => {
      isActive = false;
    };
  }, [userUid, fetchUserYearData, currentYear, dispatch]);

  return availableYears;
}
