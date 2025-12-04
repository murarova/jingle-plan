import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { House } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
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
import {
  CommonActions,
  NavigationState,
  useNavigationState,
} from "@react-navigation/native";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();

const INACTIVE_COLOR = "#999999";
const ACTIVE_COLOR = "#fe434c";

const useIsDayOverviewActive = () => {
  const isDayOverviewActive = useNavigationState((state) => {
    if (!state) return false;
    const homeRoute = state.routes.find(
      (route) => route.name === SCREENS.PERIOD_OVERVIEW
    );
    const nestedState = homeRoute?.state as NavigationState | undefined;
    if (!nestedState?.routes?.length) return false;
    const currentNestedRoute = nestedState.routes[nestedState.index ?? 0]?.name;
    return currentNestedRoute === "DayOverview";
  });

  return isDayOverviewActive;
};

const HomeTabIcon = ({ focused }: { focused: boolean }) => {
  const isDayOverviewActive = useIsDayOverviewActive();
  const color = focused && !isDayOverviewActive ? ACTIVE_COLOR : INACTIVE_COLOR;
  return <House color={color} />;
};

const HomeTabLabel = ({
  focused,
  label,
}: {
  focused: boolean;
  label: string;
}) => {
  const isDayOverviewActive = useIsDayOverviewActive();
  const color = focused && !isDayOverviewActive ? ACTIVE_COLOR : INACTIVE_COLOR;
  return <Text style={{ color, paddingTop: 10, fontSize: 12 }}>{label}</Text>;
};

export type HomeStackParamList = {
  PeriodOverviewMain: undefined;
  DayOverview: { currentDay: string };
};

function HomeStackNavigator() {
  const { t } = useTranslation();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="PeriodOverviewMain"
        component={PeriodOverviewScreen}
        options={{
          title: t("screens.periodOverview.title"),
          headerTitleAlign: "center",
          headerLeft: YearSelector,
          headerRight: AppMenu,
        }}
      />
      <HomeStack.Screen
        name="DayOverview"
        component={DayOverviewScreen}
        options={{
          headerBackTitle: t("common.back"),
          headerTitleAlign: "center",
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
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <HomeTabLabel focused={focused} label={t("common.home")} />
          ),
          headerShown: false,
        }}
        name={SCREENS.PERIOD_OVERVIEW}
        component={HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            e.preventDefault();

            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }

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
          headerTitleAlign: "center",
          tabBarLabel: t("common.summary"),
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Medal color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
        listeners={{
          tabPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }
          },
        }}
      />
      <Tab.Screen
        name={SCREENS.PLANS}
        component={PlansScreen}
        options={{
          tabBarLabel: t("common.plans"),
          title: t("common.plans"),
          headerTitleAlign: "center",
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Compas color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
        listeners={{
          tabPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }
          },
        }}
      />
      <Tab.Screen
        name={SCREENS.ALBUM}
        component={AlbumScreen}
        options={{
          tabBarLabel: t("common.album"),
          title: t("common.album"),
          headerTitleAlign: "center",
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Album color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
        listeners={{
          tabPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }
          },
        }}
      />
      <Tab.Screen
        name={SCREENS.DASHBOARD}
        component={DashboardScreen}
        options={{
          tabBarLabel: t("common.dashboard"),
          title: t("screens.dashboardScreen.title"),
          headerTitleAlign: "center",
          headerLeft: YearSelector,
          headerRight: AppMenu,
          tabBarIcon: ({ focused }) => (
            <Dashboard color={focused ? "#fe434c" : "#999999"} />
          ),
        }}
        listeners={{
          tabPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};
