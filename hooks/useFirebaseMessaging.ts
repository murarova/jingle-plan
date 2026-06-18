import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useEffect } from "react";
import { Platform } from "react-native";
import {
  removeTokenFromFirebase,
  saveTokenToFirebase,
  unsubscribeFromPremiumTopic,
} from "../services/messaging";

const messaging = getMessaging();

async function ensureAndroidChannel() {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "default",
      name: "Default",
      importance: AndroidImportance.DEFAULT,
    });
  }
}

async function registerFcmToken() {
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    return;
  }

  await ensureAndroidChannel();

  const token = await getToken(messaging);
  if (token) {
    await saveTokenToFirebase(token, Platform.OS);
  }
}

export function useFirebaseMessaging() {
  useEffect(() => {
    const auth = getAuth();
    let previousUid: string | null = auth.currentUser?.uid ?? null;

    if (auth.currentUser) {
      registerFcmToken().catch((error) => {
        console.error("Failed to setup FCM:", error);
      });
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        previousUid = user.uid;
        try {
          await registerFcmToken();
        } catch (error) {
          console.error("Failed to setup FCM:", error);
        }
        return;
      }

      if (previousUid) {
        await unsubscribeFromPremiumTopic();
        await removeTokenFromFirebase(previousUid);
        previousUid = null;
      }
    });

    const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (token) => {
      if (token) {
        await saveTokenToFirebase(token, Platform.OS);
      }
    });

    const unsubscribeMessage = onMessage(messaging, async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "Message",
        body: remoteMessage.notification?.body || "",
        android: { channelId: "default" },
      });
    });

    const unsubscribeNotificationOpened = onNotificationOpenedApp(
      messaging,
      async (remoteMessage) => {
        console.log("Notification opened app:", remoteMessage);
      }
    );

    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Notification caused app to open:", remoteMessage);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeTokenRefresh();
      unsubscribeMessage();
      unsubscribeNotificationOpened();
    };
  }, []);
}
