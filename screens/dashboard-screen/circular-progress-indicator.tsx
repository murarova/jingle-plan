import { Text } from "@/ui/text";
import { memo } from "react";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { colors } from "@/constants/colors";

interface CircularProgressIndicatorProps {
  percentage: number;
}

export const CircularProgressIndicator = memo(
  ({ percentage }: CircularProgressIndicatorProps) => (
    <CircularProgressBase
      value={percentage}
      activeStrokeColor={colors.green400}
      inActiveStrokeColor={colors.warmGray400}
      inActiveStrokeOpacity={0.2}
      radius={60}
      duration={1000}
      maxValue={100}
    >
      <Text
        className="font-bold text-3xl text-warmGray-800"
        style={{ lineHeight: 36 }}
      >
        {Math.round(percentage)}%
      </Text>
    </CircularProgressBase>
  )
);

CircularProgressIndicator.displayName = "CircularProgressIndicator";
