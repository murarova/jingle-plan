import { createApi } from "@reduxjs/toolkit/query/react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { convertToSerializableUser } from "../types/user";

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

      case "sendPasswordResetEmail":
        if (!args.email) {
          throw new Error("Email is required");
        }

        await auth().sendPasswordResetEmail(String(args.email).trim());
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
    if (error && typeof error === "object") {
      const errorCode = (error as { code?: string }).code;
      const errorMessage = (error as { message?: string }).message;

      if (errorCode === "auth/user-not-found") {
        return {
          error: { status: "CUSTOM_ERROR", data: "AUTH_EMAIL_NOT_FOUND" },
        };
      }

      if (typeof errorMessage === "string") {
        return { error: { status: "CUSTOM_ERROR", data: errorMessage } };
      }
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

    sendPasswordReset: builder.mutation<
      void,
      { email: string }
    >({
      query: ({ email }) => ({ type: "sendPasswordResetEmail", email }),
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
  useSendPasswordResetMutation,
  useDeleteCurrentUserMutation,
} = authApi;
