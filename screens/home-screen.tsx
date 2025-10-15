import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { House } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SCREENS } from "../constants/constants";
import PeriodOverviewScreen from "./period-overview-screen";
import DayOverviewScreen from "./day-overview-screen";
import { AppMenu } from "../components/app-menu";
import { SummaryScreen } from "./summary-screen";
import { PlansScreen } from "./plans-screen/plans-screen";
import Medal from "../assets/svg/medal";
import Compas from "../assets/svg/compas";
import Album from "../assets/svg/album";
import Dashboard from "../assets/svg/dashboard";
import { AlbumScreen } from "./album-screen";
import { DashboardScreen } from "./dashboard-screen/dashboard-screen";
import { YearSelector } from "../components/year-selector";
import { CommonActions } from "@react-navigation/native";

export type HomeStackParamList = {
  PeriodOverviewMain: undefined;
  DayOverview: { currentDay: string };
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const { t } = useTranslation();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerLeft: YearSelector,
        headerRight: AppMenu,
      }}
    >
      <HomeStack.Screen
        name="PeriodOverviewMain"
        component={PeriodOverviewScreen}
        options={{
          title: t("screens.periodOverview.title"),
        }}
      />
      <HomeStack.Screen
        name="DayOverview"
        component={DayOverviewScreen}
        options={{
          headerBackTitle: t("common.back"),
        }}
      />
    </HomeStack.Navigator>
  );
}

export const HomeScreen = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={SCREENS.PERIOD_OVERVIEW}
      screenOptions={{
        tabBarActiveTintColor: "#fe434c",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          height: 75,
          paddingBottom: 30,
          paddingTop: 15,
        },
        tabBarLabelStyle: { paddingTop: 10 },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <House color={focused ? "#fe434c" : "#999999"} />
          ),
          tabBarLabel: t("common.home"),
          headerShown: false,
        }}
        name={SCREENS.PERIOD_OVERVIEW}
        component={HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // Always reset to the main calendar screen
            navigation.navigate(SCREENS.PERIOD_OVERVIEW);
            // Reset the nested stack to show only PeriodOverviewMain
            setTimeout(() => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: SCREENS.PERIOD_OVERVIEW,
                  params: {
                    screen: "PeriodOverviewMain",
                  },
                })
              );
            }, 0);
          },
        })}
      />
      <Tab.Screen
        name={SCREENS.SUMMARY}
        component={SummaryScreen}
        options={{
          title: t("common.summary"),
          tabBarLabel: t("common.summary"),
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Medal color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.PLANS}
        component={PlansScreen}
        options={{
          tabBarLabel: t("common.plans"),
          title: t("common.plans"),
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Compas color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.ALBUM}
        component={AlbumScreen}
        options={{
          tabBarLabel: t("common.album"),
          title: t("common.album"),
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Album color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.DASHBOARD}
        component={DashboardScreen}
        options={{
          tabBarLabel: t("common.dashboard"),
          title: t("screens.dashboardScreen.title"),
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Dashboard color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
