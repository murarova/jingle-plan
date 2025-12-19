import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { useEffect } from "react";
import { Platform } from "react-native";
import { saveTokenToFirebase } from "../services/messaging";

export function useFirebaseMessaging() {
  useEffect(() => {
    async function setupFCM() {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log("Notification permission not granted");
          return;
        }

        if (Platform.OS === "android") {
          await notifee.createChannel({
            id: "default",
            name: "Default",
            importance: AndroidImportance.DEFAULT,
          });
        }

        const token = await messaging().getToken();
        if (token) {
          await saveTokenToFirebase(token, Platform.OS);
        }
      } catch (error) {
        console.error("Failed to setup FCM:", error);
      }
    }

    setupFCM();

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (token) => {
        if (token) {
          await saveTokenToFirebase(token, Platform.OS);
        }
      }
    );

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
      unsubscribeTokenRefresh();
      unsubscribeMessage();
      unsubscribeNotificationOpened();
    };
  }, []);
}
