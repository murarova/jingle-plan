import * as TrackingTransparency from "expo-tracking-transparency";
import { Platform } from "react-native";
import { Settings, AppEventsLogger } from "react-native-fbsdk-next";

export async function requestTrackingPermission() {
  if (Platform.OS !== "ios") return;
  try {
    const { status } =
      await TrackingTransparency.requestTrackingPermissionsAsync();

    if (status === "granted") {
      try {
        Settings.setAdvertiserTrackingEnabled(true);
      } catch (error) {
        console.log("Failed to set advertiser tracking:", error);
      }
    }

    return status;
  } catch (error) {
    console.log("Failed to request tracking permission:", error);
  }
}

export async function initializeFacebookSDK(): Promise<boolean> {
  try {
    Settings.setAppID("819298757617808");
    Settings.setAppName("Jingle Plan");
    Settings.initializeSDK();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error("Failed to initialize Facebook SDK:", error);
    return false;
  }
}

export function logFacebookEvent(
  eventName: string,
  parameters?: Record<string, any>
): void {
  try {
    if (parameters) {
      AppEventsLogger.logEvent(eventName, parameters);
    } else {
      AppEventsLogger.logEvent(eventName);
    }
  } catch (error) {
    console.log(`Failed to log Facebook event "${eventName}":`, error);
  }
}
