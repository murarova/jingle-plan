import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { memo } from "react";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/colors";

const SIZE = 156;
const STROKE = 12;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 64;
const TRACK = ((360 - GAP) / 360) * CIRCUMFERENCE;
const ROTATION = `rotate(${90 + GAP / 2} ${CENTER} ${CENTER})`;
const TRACK_COLOR = "#EAE5D9";

function Ring({ length, stroke }: { length: number; stroke: string }) {
  return (
    <Circle
      cx={CENTER}
      cy={CENTER}
      r={RADIUS}
      stroke={stroke}
      strokeWidth={STROKE}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={`${length} ${CIRCUMFERENCE}`}
      transform={ROTATION}
    />
  );
}

export const CircularProgressIndicator = memo(
  function CircularProgressIndicator({ percentage }: { percentage: number }) {
    const clamped = Math.min(100, Math.max(0, percentage));
    const progress = (clamped / 100) * TRACK;

    return (
      <Box
        className="items-center py-1"
        style={{ width: SIZE }}
        testID="circular-progress"
      >
        <Box
          className="items-center justify-center"
          style={{ width: SIZE, height: SIZE }}
        >
          <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
            <Ring length={TRACK} stroke={TRACK_COLOR} />
            {progress > 0 ? (
              <Ring length={progress} stroke={colors.green400} />
            ) : null}
          </Svg>
          <Text
            className="text-primaryText"
            style={{ fontSize: 28, lineHeight: 34, fontWeight: "700" }}
          >
            {Math.round(clamped)}%
          </Text>
        </Box>
      </Box>
    );
  },
);
