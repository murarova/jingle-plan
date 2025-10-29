import { Box, SafeAreaView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./home-screen";
import { Calendar } from "../components/calendar/calendar";

type NavigationProp = StackNavigationProp<
  HomeStackParamList,
  "PeriodOverviewMain"
>;

function PeriodOverviewScreen() {
  const nav = useNavigation<NavigationProp>();

  function pressHandler(dateString: string) {
    nav.navigate("DayOverview", {
      currentDay: dateString,
    });
  }

  return (
    <SafeAreaView flex={1}>
      <Box mt="$10">
        <Calendar pressHandler={pressHandler} />
      </Box>
    </SafeAreaView>
  );
}

export default PeriodOverviewScreen;
