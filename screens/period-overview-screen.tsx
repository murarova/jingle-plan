import { useCallback, useMemo } from "react";
import { RefreshControl } from "react-native";
import { Box, SafeAreaView, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./home-screen";
import { Calendar } from "../components/calendar/calendar";
import { useCalendarDayManager } from "../hooks/useCalendarDayManager";

type NavigationProp = StackNavigationProp<
  HomeStackParamList,
  "PeriodOverviewMain"
>;

function PeriodOverviewScreen() {
  const nav = useNavigation<NavigationProp>();
  const { refresh, isLoading, getDayConfig, isAdmin } = useCalendarDayManager();
  const isRefreshing = useMemo(() => Boolean(isLoading), [isLoading]);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  function pressHandler(dateString: string) {
    nav.navigate("DayOverview", {
      currentDay: dateString,
    });
  }

  return (
    <SafeAreaView flex={1}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Box mt="$10">
          <Calendar
            pressHandler={pressHandler}
            getDayConfig={getDayConfig}
            isAdmin={isAdmin}
            isLoading={isLoading}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PeriodOverviewScreen;
