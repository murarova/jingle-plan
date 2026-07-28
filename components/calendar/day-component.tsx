import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { DateData } from "react-native-calendars";
import { LockKeyhole } from "lucide-react-native";

export interface DayComponentProps {
  date: DateData;
  state: string;
  onPress: (dateString: string) => void;
  currentDate: string;
  progress: number;
  isLoading?: boolean;
  unlockMessage?: string;
  isSubscriber?: boolean;
  navigateToPaywall?: () => void;
  isAdmin: boolean;
  maxDate: string;
}

export const DayComponent = memo(
  ({
    date,
    onPress,
    currentDate,
    progress,
    isLoading,
    unlockMessage,
    isSubscriber = false,
    navigateToPaywall,
    maxDate,
  }: DayComponentProps) => {
    const today = date?.dateString === currentDate;
    const disabled = maxDate < date?.dateString;
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { t, i18n } = useTranslation();

    const lockedDateLabel = useMemo(() => {
      if (!date?.dateString) return "";
      const locale = i18n.language === "ua" ? "uk" : "en";
      return moment(date.dateString).locale(locale).format("D MMMM");
    }, [date?.dateString, i18n.language]);

    const defaultLockedMessage = t("calendar.lockedDayMessage", {
      date: lockedDateLabel,
    });

    const handlePress = useCallback(async () => {
      if (disabled) {
        if (!isSubscriber && navigateToPaywall) {
          navigateToPaywall();
          return;
        }
        if (tooltipTimer.current) {
          clearTimeout(tooltipTimer.current);
        }
        setIsTooltipOpen(true);
        tooltipTimer.current = setTimeout(() => {
          setIsTooltipOpen(false);
        }, 2000);
        return;
      }

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }

      onPress(date?.dateString!);
    }, [disabled, date?.dateString, onPress, isSubscriber, navigateToPaywall]);

    useEffect(
      () => () => {
        if (tooltipTimer.current) {
          clearTimeout(tooltipTimer.current);
        }
      },
      []
    );

    const tooltipMessage = unlockMessage ?? defaultLockedMessage;

    return (
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <Box className="items-center justify-center">
            {disabled ? (
              <Box className="bg-warmGray-200 w-[50px] h-[50px] rounded-[25px] items-center justify-center">
                <LockKeyhole
                  size={24}
                  color={colors.warmGray400}
                  strokeWidth={2}
                />
              </Box>
            ) : isLoading ? (
              <Box className="w-[50px] h-[50px] items-center justify-center rounded-[25px] bg-transparent">
                <Text
                  className={`${today ? "font-bold" : "font-semibold"} text-[16px] text-warmGray-900`}
                >
                  {date?.day?.toString() || ""}
                </Text>
              </Box>
            ) : (
              <CircularProgress
                value={progress}
                activeStrokeColor={
                  progress === 0 ? "transparent" : colors.green400
                }
                inActiveStrokeColor={colors.warmGray400}
                inActiveStrokeOpacity={0.2}
                circleBackgroundColor={
                  pressed ? colors.backgroundLight100 : "transparent"
                }
                showProgressValue={false}
                title={date?.day?.toString() || ""}
                titleStyle={{
                  fontSize: 16,
                  fontWeight: today ? 700 : 500,
                  color: "#292524",
                }}
                radius={25}
                activeStrokeWidth={5}
                inActiveStrokeWidth={5}
              />
            )}
            {today && (
              <Box className="bg-primary-500 absolute -top-3 w-[6px] h-[6px] rounded-[3px]" />
            )}
            {disabled && isTooltipOpen && (
              <Box
                className="absolute bg-warmGray-800 px-3 py-2 rounded-md z-50"
                style={{ bottom: 56, width: 200, left: -75 }}
              >
                <Text className="text-white text-xs text-center">
                  {tooltipMessage}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Pressable>
    );
  }
);

DayComponent.displayName = "DayComponent";
