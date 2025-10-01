import { EXPO_PUBLIC_DB } from "@env";
import { firebase } from "@react-native-firebase/database";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { TASK_CATEGORY } from "../constants/constants";
import { SerializableUser } from "../types/user";
import { CalendarConfig, ImageData } from "../types/types";

interface TaskParams {
  category: string;
  data: any;
  context: string;
  currentUser: SerializableUser | null;
  year: string;
}

interface MoodTaskParams {
  category: string;
  data: any;
  day: string;
  currentUser: SerializableUser | null;
  year: string;
}

interface RemoveTaskParams {
  category: string;
  context: string;
  currentUser: SerializableUser | null;
  day?: string;
  year: string;
}

export const createProfile = async (
  uid: string,
  name: string,
  year: string
): Promise<void> => {
  try {
    return await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`/${year}/users/${uid}`)
      .set({ userProfile: { name } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
    throw new Error("Failed to create profile: Unknown error");
  }
};

export async function createUserWithEmailAndPassword(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    const response = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("Failed to create user: Unknown error");
  }
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    const response = await auth().signInWithEmailAndPassword(email, password);
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
    throw new Error("Failed to sign in: Unknown error");
  }
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

export async function signOut(): Promise<void> {
  const currentUser = auth().currentUser;
  if (!currentUser) return;
  try {
    await auth().signOut();
  } catch (error: unknown) {
    // Ignore when there's no current user according to Firebase
    if (
      typeof error === "object" &&
      error &&
      (error as any).code === "auth/no-current-user"
    ) {
      return;
    }
    if (error instanceof Error) {
      throw new Error(`Failed to sign out: ${error.message}`);
    }
    throw new Error("Failed to sign out: Unknown error");
  }
}

export async function deleteCurrentUser(): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error("No user is currently logged in");
  }

  try {
    // First remove user data from the database
    await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`${currentUser.uid}`)
      .remove();

    // Then delete the user account
    await currentUser.delete();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw new Error("Failed to delete user: Unknown error");
  }
}

export async function getConfiguration(year: string): Promise<CalendarConfig> {
  try {
    const response = await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`${year}/configuration`)
      .once("value");

    return response.val();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get configuration: ${error.message}`);
    }
    throw new Error("Failed to get configuration: Unknown error");
  }
}

export async function getUserDayTasks(
  category: string,
  context: string,
  year: string
): Promise<any> {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error("No user provided");
  try {
    const ref =
      category === TASK_CATEGORY.MOOD
        ? `${currentUser.uid}/${category}`
        : `${currentUser.uid}/${category}/${context}`;
    const response = await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`${year}/${ref}`)
      .once("value");

    return response.val();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user day tasks: ${error.message}`);
    }
    throw new Error("Failed to get user day tasks: Unknown error");
  }
}

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    await firebase.app().database(EXPO_PUBLIC_DB).ref(`${uid}`).remove();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw new Error("Failed to delete user: Unknown error");
  }
};

export const saveMoodTask = async ({
  category,
  data,
  day,
  currentUser,
  year,
}: MoodTaskParams): Promise<void> => {
  if (!currentUser) throw new Error("No user provided");
  try {
    await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`/${year}/users/${currentUser.uid}/${category}/${day}`)
      .set(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to save mood task: ${error.message}`);
    }
    throw new Error("Failed to save mood task: Unknown error");
  }
};

export async function getUserData(uid?: string, year?: string): Promise<any> {
  if (!uid) throw new Error("No user provided");
  if (!year) throw new Error("No year provided");
  try {
    const snapshot = await firebase
      .app()
      .database(EXPO_PUBLIC_DB)
      .ref(`/${year}/users/${uid}`)
      .once("value");

    return snapshot.val() || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user data: ${error.message}`);
    }
    throw new Error("Failed to get user data: Unknown error");
  }
}

export async function saveTaskByCategory({
  currentUser,
  category,
  data,
  context,
  year,
}: TaskParams): Promise<void> {
  if (!currentUser) throw new Error("No user provided");
  const response = await firebase
    .app()
    .database(EXPO_PUBLIC_DB)
    .ref(`/${year}/users/${currentUser.uid}/${category}/${context}`)
    .set(data);

  return response;
}

export async function saveImage(
  image: ImageData,
  currentUser: SerializableUser | null,
  year: string
): Promise<void> {
  if (!currentUser) throw new Error("No user provided");
  const reference = storage().ref(
    `/images/${year}/${currentUser.uid}/${image.id}`
  );
  if (image.uri) {
    await reference.putFile(image.uri);
  }
}

export async function deleteImage(
  image: ImageData,
  currentUser: SerializableUser | null,
  year: string
): Promise<void> {
  if (!currentUser) throw new Error("No user provided");
  const reference = storage().ref(
    `/images/${year}/${currentUser.uid}/${image.id}`
  );
  await reference.delete();
}

export async function getImageUrl(
  id: string,
  currentUser: SerializableUser | null,
  year: string
): Promise<string> {
  if (!currentUser) throw new Error("No user provided");
  const url = await storage()
    .ref(`/images/${year}/${currentUser.uid}/${id}`)
    .getDownloadURL();
  return url;
}

export async function removeTask({
  category,
  context,
  currentUser,
  day,
  year,
}: RemoveTaskParams): Promise<void> {
  if (!currentUser) throw new Error("No user provided");
  const ref =
    category === TASK_CATEGORY.MOOD
      ? `${currentUser.uid}/${category}/${day}`
      : `${currentUser.uid}/${category}/${context}`;
  const response = await firebase
    .app()
    .database(EXPO_PUBLIC_DB)
    .ref(`${year}/${ref}`)
    .remove();

  return response;
}
