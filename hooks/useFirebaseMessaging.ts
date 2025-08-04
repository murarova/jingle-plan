import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { useEffect } from "react";

export function useFirebaseMessaging() {
  useEffect(() => {
    async function setupFCM() {
      await messaging().requestPermission();
      messaging().getToken();
    }

    setupFCM();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "Message",
        body: remoteMessage.notification?.body || "",
        android: { channelId: "default" },
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);
}
