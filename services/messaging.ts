import { firebase } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { EXPO_PUBLIC_DB } from "@env";

export async function saveTokenToFirebase(token: string, platform: string) {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  try {
    await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`/fcmTokens/${currentUser.uid}`)
      .set({
        token,
        platform,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Failed to save FCM token:", error);
  }
}
