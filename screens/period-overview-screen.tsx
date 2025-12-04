import { useCallback, useMemo } from "react";
import { RefreshControl } from "react-native";
import {
  Box,
  SafeAreaView,
  ScrollView,
  Text,
  Button,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./home-screen";
import { Calendar } from "../components/calendar/calendar";
import { useCalendarDayManager } from "../hooks/useCalendarDayManager";
import { useIAP } from "../hooks/useIAP";
import { useTranslation } from "react-i18next";
import { SCREENS } from "../constants/constants";

type NavigationProp = StackNavigationProp<
  HomeStackParamList,
  "PeriodOverviewMain"
>;

function PeriodOverviewScreen() {
  const nav = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { refresh, isLoading, getDayConfig, isAdmin } = useCalendarDayManager();
  const { isSubscriber, isSubscriptionResolved } = useIAP();
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
        {!isSubscriber && isSubscriptionResolved && !isAdmin && (
          <Box
            mx="$6"
            mt="$3"
            mb="$3"
            p="$4"
            borderRadius="$xl"
            backgroundColor="$green50"
            borderWidth={1}
            borderColor="$green200"
          >
            <Text fontWeight="$semibold" color="$green800" mb="$2">
              {t("paywall.lockedCalendarTitle")}
            </Text>
            <Text color="$green900" mb="$3">
              {t("paywall.lockedCalendarDescription")}
            </Text>
            <Button
              size="sm"
              borderRadius="$lg"
              alignSelf="flex-start"
              onPress={() => nav.navigate(SCREENS.PAYWALL as never)}
            >
              <Text color="$white" fontWeight="$semibold">
                {t("paywall.goToStore")}
              </Text>
            </Button>
          </Box>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PeriodOverviewScreen;
