import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { House } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { SCREENS } from "@/constants";
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
import { PlansHeaderRight } from "../plans-screen/components/plans-header-actions";
import { PlansSearchProvider } from "../plans-screen/plans-search-context";
import {
  NavigationState,
  StackActions,
  useNavigationState,
} from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { EventArg } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { Platform, Text } from "react-native";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnsavedChanges } from "@/providers";
import { colors } from "@/constants/colors";
import { screenTitleStyle, systemFontFamily } from "@/constants/typography";
import { showUnsavedChangesAlert } from "../../utils/unsaved-changes-alert";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();

const INACTIVE_COLOR = colors.secondaryText;
const ACTIVE_COLOR = "#DC6A55";

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
  return (
    <Text
      style={{
        color,
        marginTop: 4,
        fontFamily: systemFontFamily,
        fontSize: 11,
        lineHeight: 16,
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
  );
};

export type HomeStackParamList = {
  PeriodOverviewMain: undefined;
  DayOverview: { currentDay: string };
};

function HomeStackNavigator() {
  const { t } = useTranslation();
  return (
    <HomeStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.ivoryPage },
        headerStyle: { backgroundColor: colors.ivoryPage },
        headerShadowVisible: false,
        headerTintColor: colors.primaryText,
        headerTitleAlign: "center",
        headerTitleStyle: {
          ...screenTitleStyle,
          color: colors.primaryText,
        },
      }}
    >
      <HomeStack.Screen
        name="PeriodOverviewMain"
        component={PeriodOverviewScreen}
        options={{
          title: t("screens.periodOverview.title"),
          headerTitleAlign: "center",
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
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
  const insets = useSafeAreaInsets();
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
    <PlansSearchProvider>
      <Tab.Navigator
        initialRouteName={SCREENS.PERIOD_OVERVIEW}
        screenOptions={{
          sceneStyle: { backgroundColor: colors.ivoryPage },
          headerStyle: { backgroundColor: colors.ivoryPage },
          headerShadowVisible: false,
          headerTintColor: colors.primaryText,
          headerTitleStyle: {
            ...screenTitleStyle,
            color: colors.primaryText,
          },
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: colors.ivoryCard,
            borderTopColor: colors.ivoryLine,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingHorizontal: 8,
            paddingBottom: insets.bottom,
            height: 72 + insets.bottom,
          },
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              style={[
                props.style,
                { flex: 1, justifyContent: "center", padding: 0 },
              ]}
            />
          ),
          tabBarIconStyle: {
            width: 48,
            height: 36,
          },
          tabBarLabelStyle: {
            fontFamily: systemFontFamily,
            fontSize: 11,
            lineHeight: 16,
            fontWeight: "500",
          },
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
              <Medal color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
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
            headerRight: PlansHeaderRight,
            tabBarIcon: ({ focused }) => (
              <Compas color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
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
              <Album color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
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
              <Dashboard color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              handleTabPress(e, navigation, SCREENS.DASHBOARD);
            },
          })}
        />
      </Tab.Navigator>
    </PlansSearchProvider>
  );
};
