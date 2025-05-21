import { SCREENS } from "../constants/constants";
import { Box, SafeAreaView } from "@gluestack-ui/themed";
import { Calendar } from "../components/calendar";
import { Loader } from "../components/common";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { usePeriodOverviewScreenManager } from "../hooks/usePeriodOverviewScreenManager";

type NavigationProp = StackNavigationProp<RootStackParamList, "PeriodOverview">;

function PeriodOverviewScreen() {
  const nav = useNavigation<NavigationProp>();
  const { isLoading } = usePeriodOverviewScreenManager();

  function pressHandler(dateString: string) {
    nav.navigate(SCREENS.DAY_OVERVIEW, {
      currentDay: dateString,
    });
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView flex={1}>
      <Box mt={10}>
        <Calendar pressHandler={pressHandler} />
      </Box>
    </SafeAreaView>
  );
}

export default PeriodOverviewScreen;
