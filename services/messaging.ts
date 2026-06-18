import { firebase } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import { EXPO_PUBLIC_DB } from "@env";

export const PREMIUM_NOTIFICATION_TOPIC = "jingle-plan-premium";

function fcmTokenRef(uid: string) {
  return firebase
    .app()
    .database(EXPO_PUBLIC_DB)
    .ref(`/fcmTokens/${uid}`);
}

export async function saveTokenToFirebase(token: string, platform: string) {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  try {
    await fcmTokenRef(currentUser.uid).update({
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
    await fcmTokenRef(uid).remove();
  } catch (error) {
    console.error("Failed to remove FCM token:", error);
  }
}

export async function updateFcmEligibility(eligibility: {
  isSubscriber: boolean;
  isAdmin: boolean;
}) {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  try {
    await fcmTokenRef(currentUser.uid).update({
      isSubscriber: eligibility.isSubscriber,
      isAdmin: eligibility.isAdmin,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update FCM eligibility:", error);
  }
}

export async function syncPremiumTopicSubscription(isEligible: boolean) {
  try {
    if (isEligible) {
      await messaging().subscribeToTopic(PREMIUM_NOTIFICATION_TOPIC);
      return;
    }

    await messaging().unsubscribeFromTopic(PREMIUM_NOTIFICATION_TOPIC);
  } catch (error) {
    console.error("Failed to sync premium notification topic:", error);
  }
}

export async function unsubscribeFromPremiumTopic() {
  try {
    await messaging().unsubscribeFromTopic(PREMIUM_NOTIFICATION_TOPIC);
  } catch (error) {
    console.error("Failed to unsubscribe from premium topic:", error);
  }
}
