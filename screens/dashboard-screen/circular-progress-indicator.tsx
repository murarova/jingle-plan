import { memo } from "react";
import CircularProgress from "react-native-circular-progress-indicator";
import { config } from "../../config/gluestack-ui.config";

interface CircularProgressIndicatorProps {
  percentage: number;
}

export const CircularProgressIndicator = memo(
  ({ percentage }: CircularProgressIndicatorProps) => (
    <CircularProgress
      value={percentage}
      progressValueColor={config.tokens.colors.warmGray800}
      activeStrokeColor={config.tokens.colors.green400}
      inActiveStrokeColor={config.tokens.colors.warmGray400}
      inActiveStrokeOpacity={0.2}
      valueSuffix="%"
      radius={60}
      duration={1000}
      maxValue={100}
    />
  )
);

CircularProgressIndicator.displayName = "CircularProgressIndicator";
