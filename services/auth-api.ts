import { SerializableUser, convertToSerializableUser } from "../types/user";
import {
  createProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteCurrentUser,
  signOut,
} from "./services";
import { createAppAsyncThunk } from "../store/withTypes";

// For createProfile
export const createProfileAsync = createAppAsyncThunk<
  void,
  { uid: string; name: string }
>("user/createProfile", async ({ uid, name }) => {
  await createProfile(uid, name);
});

// For createUserWithEmailAndPassword
export const createUserAsync = createAppAsyncThunk<
  SerializableUser,
  { email: string; password: string }
>("user/createUser", async ({ email, password }) => {
  const user = await createUserWithEmailAndPassword(email, password);
  if (!user) throw new Error("Failed to create user");
  return convertToSerializableUser(user);
});

// For signInWithEmailAndPassword
export const signInUserAsync = createAppAsyncThunk<
  SerializableUser,
  { email: string; password: string }
>("user/signInUser", async ({ email, password }) => {
  const user = await signInWithEmailAndPassword(email, password);
  if (!user) throw new Error("Failed to sign in");
  return convertToSerializableUser(user);
});

// For deleteCurrentUser
export const deleteCurrentUserAsync = createAppAsyncThunk<void, void>(
  "user/deleteCurrentUser",
  async () => {
    await deleteCurrentUser();
  }
);

// For signOut
export const signOutAsync = createAppAsyncThunk<void, void>(
  "user/signOut",
  async () => {
    await signOut();
  }
);
