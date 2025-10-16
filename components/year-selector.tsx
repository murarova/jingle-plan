import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { setSelectedYear, selectSelectedYear } from "../store/appReducer";
import { YEARS } from "../constants/constants";
import {
  Box,
  Text,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@gluestack-ui/themed";
import { ChevronDown } from "lucide-react-native";

export const YearSelector = () => {
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector(selectSelectedYear);

  const handleYearChange = (value: string) => {
    dispatch(setSelectedYear(value));
  };

  return (
    <Box paddingLeft={16}>
      <Select
        key={selectedYear}
        selectedValue={selectedYear}
        onValueChange={handleYearChange}
      >
        <SelectTrigger borderWidth={0}>
          <Box
            backgroundColor="$white"
            paddingHorizontal="$3"
            paddingVertical="$2"
            minWidth={60}
            alignItems="center"
            flexDirection="row"
            gap="$1"
          >
            <Text fontSize="$lg" fontWeight="$semibold" color="$warmGray800">
              {selectedYear}
            </Text>
            <ChevronDown size={16} color="#999999" />
          </Box>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent paddingBottom="$10">
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {YEARS.map((year) => (
              <SelectItem key={year} label={year} value={year} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </Box>
  );
};
