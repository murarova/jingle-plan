import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Menu, MenuItem } from "@/ui/menu";
import { Pressable } from "@/ui/pressable";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/withTypes";
import {
  setSelectedYear,
  selectSelectedYear,
  selectAvailableYears,
} from "../../store/appReducer";
import { colors } from "@/constants/colors";
import { Check, ChevronDown } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export const YearSelector = () => {
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector(selectSelectedYear);
  const availableYears = useAppSelector(selectAvailableYears);

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
    <Box className="h-full justify-center pl-[16px]">
      {singleYear ? (
        <Box
          testID="year-selector-label"
          className="h-8 min-w-[72px] items-center justify-center overflow-hidden bg-white px-3"
        >
          <Text size="lg" className="font-semibold leading-6 text-warmGray-800">
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
                className="h-8 justify-center"
              >
                <Box className="h-8 min-w-[72px] flex-row items-center justify-center gap-1 overflow-hidden bg-white px-3">
                  <Text
                    size="lg"
                    className="font-semibold leading-6 text-warmGray-800"
                  >
                    {selectedYear}
                  </Text>
                  <ChevronDown
                    size={16}
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
