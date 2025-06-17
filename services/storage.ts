import AsyncStorage from "@react-native-async-storage/async-storage";
import { SerializableUser } from "../types/user";

const USER_STORAGE_KEY = "@user_data";

export const saveUserToStorage = async (user: SerializableUser) => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

export const getUserFromStorage =
  async (): Promise<SerializableUser | null> => {
    try {
      const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error getting user from storage:", error);
      return null;
    }
  };

export const removeUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Error removing user from storage:", error);
  }
};
