import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen } from "./screens/register-screen";
import { LoadingScreen } from "./screens/loading-screen";
import { LoginScreen } from "./screens/login-screen";
import { HomeScreen } from "./screens/home-screen";
import { PaywallScreen } from "./screens/paywall-screen";
import { IntroScreen } from "./screens/intro-screen";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { SCREENS } from "./constants/constants";
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
import { StatusBar, Platform } from "react-native";
import { IAPProvider } from "./hooks/useIAP";
import * as TrackingTransparency from "expo-tracking-transparency";
import * as Facebook from "expo-facebook";

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
  Register: undefined;
  Login: undefined;
  Loading: undefined;
  Home: { screen?: string } | undefined;
  Paywall: undefined;
};

async function requestTrackingPermission() {
  if (Platform.OS !== "ios") return;
  try {
    const { status } =
      await TrackingTransparency.requestTrackingPermissionsAsync();

    if (status === "granted") {
      try {
        await Facebook.setAdvertiserTrackingEnabledAsync(true);
      } catch (error) {}
    }

    return status;
  } catch (error) {}
}

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useFirebaseMessaging();

  useEffect(() => {
    (async () => {
      try {
        await Facebook.initializeAsync({
          appId: "819298757617808",
          appName: "Jingle Plan",
        });
        await requestTrackingPermission();
        await Facebook.logEventAsync("AppLaunch");
      } catch (error) {}
    })();
  }, []);

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
            name={SCREENS.PAYWALL}
            component={PaywallScreen}
            options={{
              headerTitle: "",
              headerBackTitleVisible: false,
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <IAPProvider>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <AppContent />
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </IAPProvider>
        </Provider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
