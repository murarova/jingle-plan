import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppMenu } from "./components/app-menu";
import { RegisterScreen } from "./screens/register-screen";
import { LoadingScreen } from "./screens/loading-screen";
import { LoginScreen } from "./screens/login-screen";
import { HomeScreen } from "./screens/home-screen";
import { IntroScreen } from "./screens/intro-screen";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { SCREENS } from "./constants/constants";
import DayOverviewScreen from "./screens/day-overview-screen";
import { useTranslation } from "react-i18next";
import "./i18n/i18n";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { useEffect, useState } from "react";
import { getUserFromStorage } from "./services/storage";
import { hydrateAuth } from "./store/authReducer";
import { useFirebaseMessaging } from "./hooks/useFirebaseMessaging";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Loader, GlobalLoader } from "./components/common";

(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#292524",
    background: "#ffffff",
    card: "#ffffff",
  },
};

export type RootStackParamList = {
  INTRO: undefined;
  PeriodOverview: undefined;
  DayOverview: { currentDay: string };
  Register: undefined;
  Login: undefined;
  Loading: undefined;
  Summary: undefined;
  Home: { screen: keyof RootStackParamList } | undefined; // Allow nested navigation
  Plans: undefined;
  Album: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  useFirebaseMessaging();

  useEffect(() => {
    const loadPersistedUser = async () => {
      try {
        const user = await getUserFromStorage();
        dispatch(hydrateAuth(user));
      } finally {
        setIsLoading(false);
      }
    };
    loadPersistedUser();
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name={SCREENS.LOADING}
            component={LoadingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.INTRO}
            component={IntroScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.LOGIN}
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.REGISTER}
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.HOME}
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.DAY_OVERVIEW}
            component={DayOverviewScreen}
            options={{
              headerBackTitle: t("common.back"),
              headerRight: AppMenu,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalLoader />
    </>
  );
}

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </Provider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
