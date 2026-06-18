import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import { Platform } from "react-native";
import {
  removeTokenFromFirebase,
  saveTokenToFirebase,
  unsubscribeFromPremiumTopic,
} from "../services/messaging";

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
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    return;
  }

  await ensureAndroidChannel();

  const token = await messaging().getToken();
  if (token) {
    await saveTokenToFirebase(token, Platform.OS);
  }
}

export function useFirebaseMessaging() {
  useEffect(() => {
    let previousUid: string | null = auth().currentUser?.uid ?? null;

    if (auth().currentUser) {
      registerFcmToken().catch((error) => {
        console.error("Failed to setup FCM:", error);
      });
    }

    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
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

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      if (token) {
        await saveTokenToFirebase(token, Platform.OS);
      }
    });

    const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "Message",
        body: remoteMessage.notification?.body || "",
        android: { channelId: "default" },
      });
    });

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        console.log("Notification opened app:", remoteMessage);
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
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
