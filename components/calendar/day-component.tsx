import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  Box,
  Text,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@gluestack-ui/themed";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { config } from "../../config/gluestack-ui.config";
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
    state,
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
    }, [disabled, date?.dateString, onPress]);

    useEffect(
      () => () => {
        if (tooltipTimer.current) {
          clearTimeout(tooltipTimer.current);
        }
      },
      []
    );

    const popoverMessage = unlockMessage ?? defaultLockedMessage;

    return (
      <Popover
        isOpen={disabled && isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        placement="top"
        trigger={(triggerProps) => (
          <Pressable {...triggerProps} onPress={handlePress}>
            {({ pressed }) => (
              <Box
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                {disabled ? (
                  <Box
                    width={50}
                    height={50}
                    borderRadius={25}
                    backgroundColor={config.tokens.colors.warmGray200}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LockKeyhole
                      size={24}
                      color={config.tokens.colors.warmGray400}
                      strokeWidth={2}
                    />
                  </Box>
                ) : isLoading ? (
                  <Box
                    width={50}
                    height={50}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={25}
                    backgroundColor="transparent"
                  >
                    <Text
                      fontSize={16}
                      fontWeight={today ? "$bold" : "$semibold"}
                      color="$text900"
                    >
                      {date?.day?.toString() || ""}
                    </Text>
                  </Box>
                ) : (
                  <CircularProgress
                    value={progress}
                    activeStrokeColor={
                      progress === 0
                        ? "transparent"
                        : config.tokens.colors.green400
                    }
                    inActiveStrokeColor={config.tokens.colors.warmGray400}
                    inActiveStrokeOpacity={0.2}
                    circleBackgroundColor={
                      pressed
                        ? config.tokens.colors.backgroundLight100
                        : "transparent"
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
        )}
      >
        <PopoverContent pb="$3" maxWidth="$64">
          <PopoverArrow />
          <PopoverBody>
            <Text fontSize="$sm">{popoverMessage}</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

DayComponent.displayName = "DayComponent";
