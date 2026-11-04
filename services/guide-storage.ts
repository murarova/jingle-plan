import AsyncStorage from "@react-native-async-storage/async-storage";

const guideSeenKey = (uid: string) => `@user_guide_seen:${uid}`;

export const hasSeenGuide = async (uid: string): Promise<boolean> => {
  try {
    return (await AsyncStorage.getItem(guideSeenKey(uid))) === "true";
  } catch (error) {
    console.error("Error reading guide state from storage:", error);
    return true;
  }
};

export const markGuideSeen = async (uid: string) => {
  try {
    await AsyncStorage.setItem(guideSeenKey(uid), "true");
  } catch (error) {
    console.error("Error saving guide state to storage:", error);
  }
};
