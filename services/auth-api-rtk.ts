import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { SerializableUser, convertToSerializableUser } from "../types/user";

// Custom base query for Firebase Auth operations
const authQuery = async (args: any) => {
  try {
    switch (args.type) {
      case "createUserWithEmailAndPassword":
        const createResponse = await auth().createUserWithEmailAndPassword(
          args.email,
          args.password
        );
        return { data: convertToSerializableUser(createResponse.user) };

      case "signInWithEmailAndPassword":
        const signInResponse = await auth().signInWithEmailAndPassword(
          args.email,
          args.password
        );
        return { data: convertToSerializableUser(signInResponse.user) };

      case "signOut":
        const currentUser = auth().currentUser;
        if (!currentUser) return { data: null };
        await auth().signOut();
        return { data: null };

      case "deleteCurrentUser":
        const user = auth().currentUser;
        if (!user) {
          throw new Error("No user is currently logged in");
        }
        await user.delete();
        return { data: null };

      default:
        throw new Error(`Unknown auth operation: ${args.type}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { status: "CUSTOM_ERROR", data: error.message } };
    }
    return { error: { status: "CUSTOM_ERROR", data: "Unknown error" } };
  }
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: authQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    createUser: builder.mutation<
      FirebaseAuthTypes.User,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        type: "createUserWithEmailAndPassword",
        email,
        password,
      }),
    }),

    signInUser: builder.mutation<
      FirebaseAuthTypes.User,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        type: "signInWithEmailAndPassword",
        email,
        password,
      }),
    }),

    signOut: builder.mutation<null, void>({
      query: () => ({ type: "signOut" }),
      invalidatesTags: ["Auth"],
    }),

    deleteCurrentUser: builder.mutation<null, void>({
      query: () => ({ type: "deleteCurrentUser" }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useSignInUserMutation,
  useSignOutMutation,
  useDeleteCurrentUserMutation,
} = authApi;
