import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Menu, MenuItem } from "@/ui/menu";
import { Pressable } from "@/ui/pressable";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/withTypes";
import { setSelectedYear, selectSelectedYear } from "../../store/appReducer";
import { YEARS } from "@/constants";
import { colors } from "@/constants/colors";
import { useLazyGetUserDataQuery } from "../../services/api";
import { Check, ChevronDown } from "lucide-react-native";
import * as Haptics from "expo-haptics";

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
        } catch {}
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

  const yearsNewestFirst = useMemo(
    () => [...availableYears].sort((a, b) => Number(b) - Number(a)),
    [availableYears],
  );

  const handleYearChange = (value: string) => {
    if (value === selectedYear) {
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    dispatch(setSelectedYear(value));
  };

  const singleYear = availableYears.length === 1 ? availableYears[0] : null;

  return (
    <Box className="pl-[16px]">
      {singleYear ? (
        <Box
          testID="year-selector-label"
          className="bg-white px-3 py-2 min-h-[44px] min-w-[72px] items-center justify-center"
        >
          <Text className="text-lg font-semibold text-warmGray-800">
            {singleYear}
          </Text>
        </Box>
      ) : (
        <Menu
          placement="bottom left"
          offset={6}
          style={{ width: 148, borderRadius: 12, paddingVertical: 6 }}
          trigger={(triggerProps, state) => {
            const isOpen = Boolean(state?.open);
            return (
              <Pressable
                {...triggerProps}
                testID="year-selector-trigger"
                accessibilityRole="button"
                accessibilityLabel={selectedYear}
                hitSlop={8}
              >
                <Box className="bg-white px-3 py-2 min-h-[44px] min-w-[72px] items-center flex-row gap-1">
                  <Text className="text-lg font-semibold text-warmGray-800">
                    {selectedYear}
                  </Text>
                  <ChevronDown
                    size={18}
                    color={colors.warmGray400}
                    style={{
                      transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                    }}
                  />
                </Box>
              </Pressable>
            );
          }}
        >
          {yearsNewestFirst.map((year) => {
            const isSelected = year === selectedYear;
            return (
              <MenuItem
                key={year}
                textValue={year}
                onPress={() => handleYearChange(year)}
                className="px-4 min-h-[48px] justify-between active:bg-coolGray-100"
              >
                <Text
                  className={`text-base ${
                    isSelected
                      ? "font-semibold text-warmGray-800"
                      : "text-warmGray-800"
                  }`}
                >
                  {year}
                </Text>
                {isSelected ? (
                  <Check size={18} color={colors.primary500} strokeWidth={2.5} />
                ) : null}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </Box>
  );
};
