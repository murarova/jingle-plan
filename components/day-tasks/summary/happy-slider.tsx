import { VStack } from "@/ui/vstack";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { useRating } from "../../../hooks/useRating";
import { useCallback, useMemo, useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";

interface HappySliderProps {
  isDisabled: boolean;
  rate: number;
  setRate: (rate: number) => void;
}

const TRACK_HEIGHT = 6;
const THUMB_SIZE = 28;
const HIT_HEIGHT = 44;

export const HappySlider = ({
  isDisabled,
  rate,
  setRate,
}: HappySliderProps) => {
  const getRating = useRating();
  const filledColor = isDisabled ? colors.secondaryText : colors.primary300;
  const thumbColor = isDisabled ? colors.secondaryText : colors.primary500;
  const trackRef = useRef<View>(null);
  const metrics = useRef({ x: 0, width: 1 });

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      if (width) {
        metrics.current = { x, width };
      }
    });
  }, []);

  const updateFromPageX = useCallback(
    (pageX: number) => {
      const { x, width } = metrics.current;
      if (!width) {
        return;
      }
      const next = Math.round(
        Math.min(100, Math.max(0, ((pageX - x) / width) * 100)),
      );
      setRate(next);
    },
    [setRate],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isDisabled,
        onMoveShouldSetPanResponder: () => !isDisabled,
        onStartShouldSetPanResponderCapture: () => !isDisabled,
        onMoveShouldSetPanResponderCapture: () => !isDisabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          const pageX = event.nativeEvent.pageX;
          trackRef.current?.measureInWindow((x, _y, width) => {
            if (width) {
              metrics.current = { x, width };
            }
            updateFromPageX(pageX);
          });
        },
        onPanResponderMove: (event) => {
          updateFromPageX(event.nativeEvent.pageX);
        },
      }),
    [isDisabled, updateFromPageX],
  );

  return (
    <VStack space="2xl" className="mt-4 mb-10">
      <Box>
        <Text size="6xl" className="text-center pb-2">
          {getRating(rate)?.icon}
        </Text>
        <Text className="text-center">{getRating(rate)?.text}</Text>
      </Box>
      <View style={styles.hitArea} {...panResponder.panHandlers}>
        <View style={styles.trackWrap}>
          <View ref={trackRef} onLayout={measureTrack} style={styles.track}>
            <View
              style={[
                styles.filled,
                {
                  width: `${rate}%`,
                  backgroundColor: filledColor,
                  opacity: isDisabled ? 0.4 : 1,
                },
              ]}
            />
          </View>
          <View
            pointerEvents="none"
            style={[
              styles.thumb,
              {
                left: `${rate}%`,
                backgroundColor: thumbColor,
                opacity: isDisabled ? 0.95 : 1,
              },
            ]}
          />
        </View>
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  hitArea: {
    width: "100%",
    height: HIT_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: THUMB_SIZE / 2,
  },
  trackWrap: {
    width: "100%",
    height: HIT_HEIGHT,
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.ivoryBadge,
    overflow: "hidden",
  },
  filled: {
    height: "100%",
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: -THUMB_SIZE / 2,
    top: (HIT_HEIGHT - THUMB_SIZE) / 2,
  },
});
