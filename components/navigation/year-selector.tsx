import {
  Select,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/ui/select";

import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/withTypes";
import { setSelectedYear, selectSelectedYear } from "../../store/appReducer";
import { YEARS } from "@/constants";
import { useLazyGetUserDataQuery } from "../../services/api";
import { ChevronDown } from "lucide-react-native";

export const YearSelector = () => {
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector(selectSelectedYear);
  const userUid = useAppSelector((state) => state.auth.userUid);
  const currentYear = YEARS[YEARS.length - 1];
  const [availableYears, setAvailableYears] = useState<string[]>([currentYear]);
  const [fetchUserYearData] = useLazyGetUserDataQuery();

  useEffect(() => {
    let isActive = true;
    if (!userUid) {
      return;
    }

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
        } catch (error) {
          // ignore errors per year; we'll keep existing list
        }
      }

      if (!isActive) return;

      const orderedYears = YEARS.filter(
        (year) => year === currentYear || yearsWithData.has(year)
      );

      orderedYears.length && setAvailableYears(orderedYears);
    };

    loadYears(userUid);

    return () => {
      isActive = false;
    };
  }, [userUid, fetchUserYearData, currentYear]);

  const handleYearChange = (value: string) => {
    dispatch(setSelectedYear(value));
  };

  const singleYear = availableYears.length === 1 ? availableYears[0] : null;

  return (
    <Box className="pl-[16px]">
      {singleYear ? (
        <Box className="bg-white px-3 py-2 min-w-[60px] items-center">
          <Text className="text-lg font-semibold text-warmGray-800">
            {singleYear}
          </Text>
        </Box>
      ) : (
        <Select
          key={selectedYear}
          selectedValue={selectedYear}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="border-[0px]">
            <Box className="bg-white px-3 py-2 min-w-[60px] items-center flex-row gap-1">
              <Text className="text-lg font-semibold text-warmGray-800">
                {selectedYear}
              </Text>
              <ChevronDown size={16} color="#999999" />
            </Box>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent className="pb-10">
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {availableYears.length ? (
                availableYears.map((year) => (
                  <SelectItem key={year} label={year} value={year} />
                ))
              ) : (
                <SelectItem
                  isDisabled
                  key="no-data"
                  label={selectedYear}
                  value={selectedYear}
                />
              )}
            </SelectContent>
          </SelectPortal>
        </Select>
      )}
    </Box>
  );
};
