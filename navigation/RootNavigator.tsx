import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RegisterScreen } from "@/screens/register-screen";
import { LoadingScreen } from "@/screens/loading-screen";
import { LoginScreen } from "@/screens/login-screen";
import { HomeScreen } from "@/screens/home-screen";
import { PaywallScreen } from "@/screens/paywall-screen";
import { IntroScreen } from "@/screens/intro-screen";
import { Box } from "@/ui/box";
import { SCREENS } from "@/constants/screens";
import {
  clearLegacyCredentials,
  getUserFromStorage,
} from "@/services/storage";
import { hydrateAuth } from "@/store/authReducer";
import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";
import { useFcmEligibilitySync } from "@/hooks/useFcmEligibilitySync";
import { useAvailableYears } from "@/hooks/useAvailableYears";
import { useIAP } from "@/hooks/useIAP";
import { useGetUserProfileQuery } from "@/services/api";
import { useAppSelector } from "@/store/withTypes";
import { Loader, GlobalLoader } from "@/components/common";
import { colors } from "@/constants/colors";
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { isSubscriber, isSubscriptionResolved } = useIAP();
  const { data: userProfile } = useGetUserProfileQuery(
    { uid: currentUser?.uid! },
    { skip: !currentUser?.uid },
  );
  const isAdmin = userProfile?.role === "admin" || false;

  useFirebaseMessaging();
  useFcmEligibilitySync(isSubscriber, isAdmin, isSubscriptionResolved);
  useAvailableYears();

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
        const [user] = await Promise.all([
          getUserFromStorage(),
          clearLegacyCredentials(),
        ]);
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
        <Stack.Navigator
          screenOptions={{
            cardStyle: { backgroundColor: colors.ivoryPage },
            headerStyle: { backgroundColor: colors.ivoryPage },
            headerShadowVisible: false,
          }}
        >
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
              headerBackTitle: t("common.back"),
              headerTintColor: colors.primaryText,
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
