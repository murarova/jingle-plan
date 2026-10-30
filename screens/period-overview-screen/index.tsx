import { AppButton } from "@/components/common";
import { ScreenBackground } from "@/components/common/app-background";
import { Text } from "@/ui/text";
import { ScrollView } from "@/ui/scroll-view";
import { Box } from "@/ui/box";
import { useCallback, useContext, useState } from "react";
import { HeaderHeightContext } from "@react-navigation/elements";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "@/screens/home-screen";
import { Calendar } from "../../components/calendar/calendar";
import { useCalendarDayManager } from "../../hooks/useCalendarDayManager";
import { useIAP } from "../../hooks/useIAP";
import { useTranslation } from "react-i18next";
import { SCREENS, YEARS, cardShadow } from "@/constants";
import { typeRole } from "@/constants/typography";
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
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
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

  return (
    <ScreenBackground>
      {isLoading || !isSubscriptionResolved ? (
        <Box className="flex-1" />
      ) : (
        <Box className="flex-1" style={{ paddingTop: headerHeight }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Box className="px-4 pt-6">
              <Box
                className="overflow-hidden rounded-3xl border border-ivory-line bg-ivory-card px-4 pb-7 pt-6"
                style={cardShadow}
              >
                <Calendar
                  pressHandler={pressHandler}
                  getDayConfig={getDayConfig}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                  currentYear={currentYear}
                  currentDate={currentDate}
                />
              </Box>
            </Box>
            {!isSubscriber &&
              isSubscriptionResolved &&
              !isAdmin &&
              isLastYear && (
                <Box className="mx-4 mt-3 gap-3 rounded-3xl border border-ivory-line bg-ivory-card p-5">
                  <Text className={`${typeRole.cardHeading} text-primaryText`}>
                    {t("paywall.lockedCalendarTitle")}
                  </Text>
                  <Text className={`${typeRole.secondary} text-secondaryText`}>
                    {t("paywall.lockedCalendarDescription")}
                  </Text>
                  <AppButton
                    label={t("paywall.goToStore")}
                    onPress={() => nav.navigate(SCREENS.PAYWALL as never)}
                    className="self-start"
                  />
                </Box>
              )}
          </ScrollView>
        </Box>
      )}
    </ScreenBackground>
  );
}

export default PeriodOverviewScreen;
