import { Platform } from "react-native";
import { EXPO_PUBLIC_IOS_SUBSCRIPTION_ID } from "@env";

export const SUBSCRIPTION_IDS: string[] =
  Platform.OS === "ios"
    ? [EXPO_PUBLIC_IOS_SUBSCRIPTION_ID].filter(
        (v): v is string => typeof v === "string" && v.length > 0
      )
    : [];

export const IAP_DEBUG = __DEV__ ? true : false;


