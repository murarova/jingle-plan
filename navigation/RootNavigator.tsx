import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RegisterScreen } from "@/screens/register-screen";
import { LoadingScreen } from "@/screens/loading-screen";
import { LoginScreen } from "@/screens/login-screen";
import { HomeScreen } from "@/screens/home-screen";
import { PaywallScreen } from "@/screens/paywall-screen";
import { IntroScreen } from "@/screens/intro-screen";
import { Box } from "@/ui/box";
import { SCREENS } from "@/constants/screens";
import { getUserFromStorage } from "@/services/storage";
import { hydrateAuth } from "@/store/authReducer";
import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";
import { useFcmEligibilitySync } from "@/hooks/useFcmEligibilitySync";
import { useIAP } from "@/hooks/useIAP";
import { useGetUserProfileQuery } from "@/services/api";
import { useAppSelector } from "@/store/withTypes";
import { Loader, GlobalLoader } from "@/components/common";
import { RootStackParamList } from "./types";
import { navigationTheme } from "./theme";
import {
  initializeFacebookSDK,
  logFacebookEvent,
  requestTrackingPermission,
} from "./bootstrap";

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { isSubscriber, isSubscriptionResolved } = useIAP();
  const { data: userProfile } = useGetUserProfileQuery(
    { uid: currentUser?.uid! },
    { skip: !currentUser?.uid }
  );
  const isAdmin = userProfile?.role === "admin" || false;

  useFirebaseMessaging();
  useFcmEligibilitySync(isSubscriber, isAdmin, isSubscriptionResolved);

  useEffect(() => {
    (async () => {
      try {
        const sdkInitialized = await initializeFacebookSDK();
        await requestTrackingPermission();
        if (sdkInitialized) {
          logFacebookEvent("AppLaunch");
        }
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
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
    return <Loader size="large" />;
  }

  return (
    <Box className="flex-1">
      <NavigationContainer theme={navigationTheme}>
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
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalLoader />
    </Box>
  );
}

export function RootNavigator() {
  return <AppContent />;
}
