import {
  getDatabase,
  ref,
  remove,
  update,
} from "@react-native-firebase/database";
import { getAuth } from "@react-native-firebase/auth";
import {
  getAPNSToken,
  getMessaging,
  isDeviceRegisteredForRemoteMessages,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { EXPO_PUBLIC_DB } from "@env";

export const PREMIUM_NOTIFICATION_TOPIC = "jingle-plan-premium";

const messaging = getMessaging();

let desiredPremiumTopicState: boolean | null = null;

function fcmTokenRef(uid: string) {
  return ref(getDatabase(undefined, EXPO_PUBLIC_DB), `/fcmTokens/${uid}`);
}

async function canManageTopics() {
  if (Platform.OS !== "ios") return true;
  if (!isDeviceRegisteredForRemoteMessages(messaging)) return false;
  return (await getAPNSToken(messaging)) !== null;
}

export async function saveTokenToFirebase(token: string, platform: string) {
  const currentUser = getAuth().currentUser;
  if (!currentUser) return;

  try {
    await update(fcmTokenRef(currentUser.uid), {
      token,
      platform,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save FCM token:", error);
  }
}

export async function removeTokenFromFirebase(uid: string) {
  try {
    await remove(fcmTokenRef(uid));
  } catch (error) {
    console.error("Failed to remove FCM token:", error);
  }
}

export async function updateFcmEligibility(eligibility: {
  isSubscriber: boolean;
  isAdmin: boolean;
}) {
  const currentUser = getAuth().currentUser;
  if (!currentUser) return;

  try {
    await update(fcmTokenRef(currentUser.uid), {
      isSubscriber: eligibility.isSubscriber,
      isAdmin: eligibility.isAdmin,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update FCM eligibility:", error);
  }
}

export async function syncPremiumTopicSubscription(isEligible: boolean) {
  desiredPremiumTopicState = isEligible;
  await retryPremiumTopicSync();
}

export async function retryPremiumTopicSync() {
  const isEligible = desiredPremiumTopicState;
  if (isEligible === null) return;

  try {
    if (!(await canManageTopics())) return;

    if (isEligible) {
      await subscribeToTopic(messaging, PREMIUM_NOTIFICATION_TOPIC);
      return;
    }

    await unsubscribeFromTopic(messaging, PREMIUM_NOTIFICATION_TOPIC);
  } catch (error) {
    console.error("Failed to sync premium notification topic:", error);
  }
}

export async function unsubscribeFromPremiumTopic() {
  desiredPremiumTopicState = null;

  try {
    if (!(await canManageTopics())) return;
    await unsubscribeFromTopic(messaging, PREMIUM_NOTIFICATION_TOPIC);
  } catch (error) {
    console.error("Failed to unsubscribe from premium topic:", error);
  }
}
