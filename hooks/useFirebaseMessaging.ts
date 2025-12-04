import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { useEffect } from "react";
import { Platform } from "react-native";

export function useFirebaseMessaging() {
  useEffect(() => {
    async function setupFCM() {
      await messaging().requestPermission();
      await messaging().getToken();

      if (Platform.OS === "android") {
        await notifee.createChannel({
          id: "default",
          name: "Default",
          importance: AndroidImportance.DEFAULT,
        });
      }
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
