import { Linking } from "react-native";

export const ANDROID_APPLICATION_ID = "com.murarova.jingleplan";

export const PLAY_STORE_LISTING_URL = `https://play.google.com/store/apps/details?id=${ANDROID_APPLICATION_ID}`;

const PLAY_STORE_MARKET_URL = `market://details?id=${ANDROID_APPLICATION_ID}`;

export async function openPlayStoreListing() {
  try {
    await Linking.openURL(PLAY_STORE_MARKET_URL);
  } catch {
    await Linking.openURL(PLAY_STORE_LISTING_URL);
  }
}
