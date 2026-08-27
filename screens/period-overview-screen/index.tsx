import { Button } from "@/ui/button";
import { Text } from "@/ui/text";
import { ScrollView } from "@/ui/scroll-view";
import { Box } from "@/ui/box";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./home-screen";
import { Calendar } from "../../components/calendar/calendar";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { useIAP } from "../../hooks/useIAP";
import { useTranslation } from "react-i18next";
import { SCREENS, YEARS } from "@/constants";
import { useAppSelector } from "../../store/withTypes";
import { selectSelectedYear } from "../../store/appReducer";
import { useCurrentDate } from "../../hooks/useCurrentDate";

type NavigationProp = StackNavigationProp<
  HomeStackParamList,
  "PeriodOverviewMain"
>;

function PeriodOverviewScreen() {
  const nav = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [currentDate, updateCurrentDate] = useCurrentDate();
  const { refresh, isLoading, getDayConfig, isAdmin } =
    useCalendarDayManager(updateCurrentDate);
  const { isSubscriber, isSubscriptionResolved } = useIAP();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentYear = YEARS[YEARS.length - 1];
  const selectedYear = useAppSelector(selectSelectedYear);
  const isLastYear = selectedYear === currentYear;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  function pressHandler(dateString: string) {
    nav.navigate("DayOverview", {
      currentDay: dateString,
    });
  }

  if (isLoading || !isSubscriptionResolved) {
    return <Box className="flex-1 bg-white" />;
  }

  return (
    <Box className="flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Box className="mt-10">
          <Calendar
            pressHandler={pressHandler}
            getDayConfig={getDayConfig}
            isAdmin={isAdmin}
            isLoading={isLoading}
            currentYear={currentYear}
            currentDate={currentDate}
          />
        </Box>
        {!isSubscriber && isSubscriptionResolved && !isAdmin && isLastYear && (
          <Box className="mx-6 mt-3 mb-3 p-4 rounded-xl bg-green-50 border border-green-200">
            <Text className="font-semibold text-green-800 mb-2">
              {t("paywall.lockedCalendarTitle")}
            </Text>
            <Text className="text-green-900 mb-3">
              {t("paywall.lockedCalendarDescription")}
            </Text>
            <Button
              size="sm"
              onPress={() => nav.navigate(SCREENS.PAYWALL as never)}
              className="rounded-lg self-start"
            >
              <Text className="text-white font-semibold">
                {t("paywall.goToStore")}
              </Text>
            </Button>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}

export default PeriodOverviewScreen;
