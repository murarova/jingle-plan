import { Text } from "@/ui/text";
import { Box } from "@/ui/box";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { colors } from "@/constants/colors";
import { cardShadow } from "@/constants/shadow";
import {
  bodyFontSize,
  systemFontFamily,
  typeRole,
} from "@/constants/typography";
import CircularProgress from "react-native-circular-progress-indicator";
import { DateData } from "react-native-calendars";
import { LockKeyhole } from "lucide-react-native";
import { Tooltip, TooltipContent } from "@/ui/tooltip";
import Star from "../../assets/svg/star";

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
  starredDates?: string[];
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
    starredDates,
  }: DayComponentProps) => {
    const today = date?.dateString === currentDate;
    const showStar = Boolean(
      !today && date?.dateString && starredDates?.includes(date.dateString),
    );
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
      [],
    );

    const tooltipMessage = unlockMessage ?? defaultLockedMessage;

    return (
      <Tooltip
        placement="top"
        offset={8}
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        closeOnClick={false}
        pointerEvents="box-none"
        className="absolute inset-0 overflow-visible"
        trigger={({ ref, collapsable }) => (
          <Pressable
            ref={ref}
            collapsable={collapsable}
            testID={`calendar-day-${date.dateString}`}
            onPress={handlePress}
          >
            {({ pressed }) => (
              <Box className="relative items-center justify-center">
                {disabled ? (
                  <Box
                    className="h-[41px] w-[41px] items-center justify-center rounded-full"
                    style={{
                      borderWidth: 2,
                      borderColor: "rgba(75,180,173,0.18)",
                    }}
                  >
                    <LockKeyhole
                      size={16}
                      color={colors.secondaryText}
                      strokeWidth={2}
                    />
                  </Box>
                ) : isLoading ? (
                  <Box
                    className="h-[41px] w-[41px] items-center justify-center rounded-full"
                    style={{
                      borderWidth: 2,
                      borderColor: "rgba(75,180,173,0.18)",
                    }}
                  >
                    <Text
                      className={`text-primaryText ${today ? "font-bold" : ""}`}
                    >
                      {date?.day?.toString() || ""}
                    </Text>
                  </Box>
                ) : (
                  <CircularProgress
                    value={progress}
                    duration={0}
                    activeStrokeColor={
                      progress === 0 ? "transparent" : colors.green400
                    }
                    inActiveStrokeColor={colors.green400}
                    inActiveStrokeOpacity={0.18}
                    circleBackgroundColor={
                      pressed ? colors.ivoryBadge : "transparent"
                    }
                    showProgressValue={false}
                    title={date?.day?.toString() || ""}
                    titleStyle={{
                      fontFamily: systemFontFamily,
                      fontSize: bodyFontSize,
                      fontWeight: today ? "700" : "400",
                      color: colors.primaryText,
                    }}
                    radius={20.5}
                    activeStrokeWidth={2}
                    inActiveStrokeWidth={2}
                  />
                )}
                {today && (
                  <Box
                    testID={`calendar-today-${date.dateString}`}
                    className="absolute -top-3 h-[6px] w-[6px] rounded-full bg-primary-500"
                  />
                )}
                {showStar && (
                  <Box
                    testID={`calendar-star-${date.dateString}`}
                    className="absolute -top-[21px] left-0 right-0 items-center"
                  >
                    <Star />
                  </Box>
                )}
              </Box>
            )}
          </Pressable>
        )}
      >
        <TooltipContent
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          className="w-[200px] rounded-2xl border border-ivory-line bg-ivory-card px-3 py-2"
          style={cardShadow}
        >
          <Text
            className={`${typeRole.supporting} text-center text-primaryText`}
          >
            {tooltipMessage}
          </Text>
        </TooltipContent>
      </Tooltip>
    );
  },
);

DayComponent.displayName = "DayComponent";
