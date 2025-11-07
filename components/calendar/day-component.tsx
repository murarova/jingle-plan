import * as Haptics from "expo-haptics";
import { memo, useCallback } from "react";
import { Pressable, Box, Text } from "@gluestack-ui/themed";
import { config } from "../../config/gluestack-ui.config";
import CircularProgress from "react-native-circular-progress-indicator";
import { DateData } from "react-native-calendars";

export interface DayComponentProps {
  date: DateData;
  state: string;
  onPress: (dateString: string) => void;
  currentDate: string;
  progress: number;
  isLoading?: boolean;
}

export const DayComponent = memo(
  ({
    date,
    state,
    onPress,
    currentDate,
    progress,
    isLoading,
  }: DayComponentProps) => {
    const today = date?.dateString === currentDate;
    const disabled = state === "disabled";

    const handlePress = useCallback(async () => {
      if (disabled) return;

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }

      onPress(date?.dateString!);
    }, [disabled, date?.dateString, onPress]);

    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Box alignItems="center" justifyContent="center" position="relative">
            {isLoading ? (
              <Box
                width={50}
                height={50}
                alignItems="center"
                justifyContent="center"
                borderRadius={25}
                backgroundColor={
                  disabled ? config.tokens.colors.warmGray200 : "transparent"
                }
              >
                <Text
                  fontSize={16}
                  fontWeight={today ? "$bold" : "$semibold"}
                  color={disabled ? "$warmGray400" : "$text900"}
                >
                  {date?.day?.toString() || ""}
                </Text>
              </Box>
            ) : (
              <CircularProgress
                value={progress}
                activeStrokeColor={
                  progress === 0 ? "transparent" : config.tokens.colors.green400
                }
                inActiveStrokeColor={
                  disabled
                    ? config.tokens.colors.warmGray300
                    : config.tokens.colors.warmGray400
                }
                inActiveStrokeOpacity={0.2}
                circleBackgroundColor={
                  disabled
                    ? config.tokens.colors.warmGray200
                    : pressed
                    ? config.tokens.colors.backgroundLight100
                    : "transparent"
                }
                showProgressValue={false}
                title={date?.day?.toString() || ""}
                activeStrokeWidth={disabled ? 0 : 5}
                inActiveStrokeWidth={disabled ? 0 : 5}
                titleStyle={{
                  fontSize: 16,
                  fontWeight: today ? 700 : 500,
                  color: disabled
                    ? config.tokens.colors.warmGray400
                    : "#292524",
                }}
                radius={25}
              />
            )}
            {today && (
              <Box
                position="absolute"
                top={-12}
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={config.tokens.colors.primary500}
              />
            )}
          </Box>
        )}
      </Pressable>
    );
  }
);

DayComponent.displayName = "DayComponent";
