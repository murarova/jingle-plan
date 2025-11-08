import AsyncStorage from "@react-native-async-storage/async-storage";

const CREDENTIALS_KEY = "@jp.credentials";

export interface StoredCredentials {
  email: string;
  password: string;
}

export const saveCredentials = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const payload: StoredCredentials = { email, password };
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(payload));
  } catch (error) {
    console.log("Failed to save credentials", error);
  }
};

export const loadCredentials = async (): Promise<StoredCredentials | null> => {
  try {
    const stored = await AsyncStorage.getItem(CREDENTIALS_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as StoredCredentials;
  } catch (error) {
    console.log("Failed to load credentials", error);
    return null;
  }
};

export const clearCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
    console.log("Failed to clear credentials", error);
  }
};


