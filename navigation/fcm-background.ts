import { Platform } from "react-native";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "default",
      name: "Default",
      importance: AndroidImportance.DEFAULT,
    });
  }

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "Message",
    body: remoteMessage.notification?.body || "",
    android: { channelId: "default" },
  });
});
