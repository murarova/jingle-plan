import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { House } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { SCREENS } from "../../constants/constants";
import PeriodOverviewScreen from "../period-overview-screen";
import DayOverviewScreen from "../day-overview-screen";
import { AppMenu } from "../../components/navigation/app-menu";
import { SummaryScreen } from "../summary-screen";
import { PlansScreen } from "../plans-screen";
import Medal from "../../assets/svg/medal";
import Compas from "../../assets/svg/compas";
import Album from "../../assets/svg/album";
import Dashboard from "../../assets/svg/dashboard";
import { AlbumScreen } from "../album-screen";
import { DashboardScreen } from "../dashboard-screen";
import { YearSelector } from "../../components/navigation/year-selector";
import {
  NavigationState,
  StackActions,
  useNavigationState,
} from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { EventArg } from "@react-navigation/native";
import { Text } from "react-native";
import { useCallback } from "react";
import { useUnsavedChanges } from "../../contexts/UnsavedChangesContext";
import { showUnsavedChangesAlert } from "../../utils/unsaved-changes-alert";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();

const INACTIVE_COLOR = "#999999";
const ACTIVE_COLOR = "#fe434c";

const useIsDayOverviewActive = () => {
  const isDayOverviewActive = useNavigationState((state) => {
    if (!state) return false;
    const homeRoute = state.routes.find(
      (route) => route.name === SCREENS.PERIOD_OVERVIEW,
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
  return <Text style={{ color, fontSize: 12 }}>{label}</Text>;
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

const navigateToPeriodOverview = (
  navigation: BottomTabNavigationProp<Record<string, object | undefined>>,
): boolean => {
  const state = navigation.getState();
  const homeTabIndex = state.routes.findIndex(
    (route) => route.name === SCREENS.PERIOD_OVERVIEW,
  );
  const homeRoute = state.routes[homeTabIndex];
  const nestedState = homeRoute?.state as NavigationState | undefined;
  const needsPop = (nestedState?.index ?? 0) > 0;
  const isHomeFocused = state.index === homeTabIndex;

  if (!needsPop) {
    return false;
  }

  if (!isHomeFocused) {
    navigation.navigate(SCREENS.PERIOD_OVERVIEW);
  }

  if (nestedState?.key) {
    navigation.dispatch({
      ...StackActions.popToTop(),
      target: nestedState.key,
    });
  }

  return true;
};

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { isUnsavedChanges, setUnsavedChanges } = useUnsavedChanges();

  const handleTabPress = useCallback(
    (
      e: EventArg<"tabPress", true, undefined>,
      navigation: BottomTabNavigationProp<Record<string, object | undefined>>,
      targetScreen?: string,
      isPeriodOverview = false,
    ) => {
      if (isUnsavedChanges) {
        e.preventDefault();

        showUnsavedChangesAlert(t, async () => {
          setUnsavedChanges(false);
          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (error) {
            console.log("Haptics not available");
          }
          if (isPeriodOverview) {
            const state = navigation.getState();
            const homeTabIndex = state.routes.findIndex(
              (route) => route.name === SCREENS.PERIOD_OVERVIEW,
            );
            const isHomeFocused = state.index === homeTabIndex;

            if (!navigateToPeriodOverview(navigation) && !isHomeFocused) {
              navigation.navigate(SCREENS.PERIOD_OVERVIEW);
            }
          } else if (targetScreen) {
            navigation.navigate(targetScreen);
          }
        });
        return;
      }

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics not available");
      }
    },
    [isUnsavedChanges, setUnsavedChanges, t],
  );

  return (
    <Tab.Navigator
      initialRouteName={SCREENS.PERIOD_OVERVIEW}
      screenOptions={{
        tabBarActiveTintColor: "#fe434c",
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <HomeTabLabel focused={focused} label={t("common.home")} />
          ),
          headerShown: false,
          popToTopOnBlur: true,
        }}
        name={SCREENS.PERIOD_OVERVIEW}
        component={HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (isUnsavedChanges) {
              handleTabPress(e, navigation, SCREENS.PERIOD_OVERVIEW, true);
              return;
            }

            if (navigateToPeriodOverview(navigation)) {
              e.preventDefault();
            }

            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log("Haptics not available");
            }
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            handleTabPress(e, navigation, SCREENS.SUMMARY);
          },
        })}
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            handleTabPress(e, navigation, SCREENS.PLANS);
          },
        })}
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            handleTabPress(e, navigation, SCREENS.ALBUM);
          },
        })}
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            handleTabPress(e, navigation, SCREENS.DASHBOARD);
          },
        })}
      />
    </Tab.Navigator>
  );
};
