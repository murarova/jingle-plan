import { createApi } from "@reduxjs/toolkit/query/react";
import { EXPO_PUBLIC_DB } from "@env";
import { firebase } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { TASK_CATEGORY } from "../constants/constants";
import { CalendarConfig, ImageData } from "../types/types";

// Custom base query for Firebase operations
const firebaseQuery = async (args: any, api: any): Promise<any> => {
  // Get current user directly from Firebase Auth
  const currentUser = auth().currentUser;

  try {
    // Handle different operation types
    switch (args.type) {
      case "getConfiguration":
        const configResponse = await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(`${args.year}/configuration`)
          .once("value");
        return { data: configResponse.val() };

      case "getUserData":
        if (!args.uid || !args.year) {
          throw new Error("No user or year provided");
        }
        const userResponse = await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(`/${args.year}/users/${args.uid}`)
          .once("value");
        return { data: userResponse.val() || null };

      case "createProfile":
        await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(`/${args.year}/users/${args.uid}`)
          .set({ userProfile: { name: args.name } });
        return { data: null };

      case "saveTaskByCategory":
        if (!currentUser) throw new Error("No user provided");
        await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(
            `/${args.year}/users/${currentUser.uid}/${args.category}/${args.context}`
          )
          .set(args.data);
        return { data: null };

      case "saveMoodTask":
        if (!currentUser) throw new Error("No user provided");
        await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(
            `/${args.year}/users/${currentUser.uid}/${args.category}/${args.day}`
          )
          .set(args.data);
        return { data: args.data };

      case "removeTask":
        if (!currentUser) throw new Error("No user provided");
        const ref =
          args.category === TASK_CATEGORY.MOOD
            ? `${currentUser.uid}/${args.category}/${args.day}`
            : `${currentUser.uid}/${args.category}/${args.context}`;

        await firebase
          .app()
          .database(EXPO_PUBLIC_DB)
          .ref(`${args.year}/users/${ref}`)
          .remove();
        return { data: null };

      case "saveImage":
        if (!currentUser) throw new Error("No user provided");
        const imageRef = storage().ref(
          `/images/${args.year}/${currentUser.uid}/${args.image.id}`
        );
        if (!args.image?.uri) {
          throw new Error("No image uri provided");
        }
        await imageRef.putFile(args.image.uri);
        return { data: null };

      case "deleteImage":
        if (!currentUser) throw new Error("No user provided");
        const deleteRef = storage().ref(
          `/images/${args.year}/${currentUser.uid}/${args.image.id}`
        );
        await deleteRef.delete();
        return { data: null };

      case "getImageUrl":
        if (!currentUser) throw new Error("No user provided");
        const urlRef = storage().ref(
          `/images/${args.year}/${currentUser.uid}/${args.id}`
        );
        const url = await urlRef.getDownloadURL();
        return { data: url };

      default:
        throw new Error(`Unknown operation type: ${args.type}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { status: "CUSTOM_ERROR", data: error.message } };
    }
    return { error: { status: "CUSTOM_ERROR", data: "Unknown error" } };
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: firebaseQuery,
  tagTypes: ["UserData", "Configuration", "UserProfile"],
  endpoints: (builder) => ({
    // Configuration
    getConfiguration: builder.query<CalendarConfig, { year: string }>({
      query: ({ year }) => ({ type: "getConfiguration", year }),
      providesTags: ["Configuration"],
    }),

    // User Data
    getUserData: builder.query<any, { uid: string; year: string }>({
      query: ({ uid, year }) => ({ type: "getUserData", uid, year }),
      providesTags: ["UserData"],
    }),

    // User Profile
    createProfile: builder.mutation<
      void,
      { uid: string; name: string; year: string }
    >({
      query: ({ uid, name, year }) => ({
        type: "createProfile",
        uid,
        name,
        year,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    // Tasks
    saveTaskByCategory: builder.mutation<
      void,
      {
        category: string;
        data: any;
        context: string;
        year: string;
      }
    >({
      query: ({ category, data, context, year }) => ({
        type: "saveTaskByCategory",
        category,
        data,
        context,
        year,
      }),
      invalidatesTags: ["UserData"],
    }),

    saveMoodTask: builder.mutation<
      any,
      {
        category: string;
        data: any;
        day: string;
        year: string;
      }
    >({
      query: ({ category, data, day, year }) => ({
        type: "saveMoodTask",
        category,
        data,
        day,
        year,
      }),
      invalidatesTags: ["UserData"],
    }),

    removeTask: builder.mutation<
      void,
      {
        category: string;
        context: string;
        day?: string;
        year: string;
      }
    >({
      query: ({ category, context, day, year }) => ({
        type: "removeTask",
        category,
        context,
        day,
        year,
      }),
      invalidatesTags: ["UserData"],
    }),

    // Images
    saveImage: builder.mutation<void, { image: ImageData; year: string }>({
      query: ({ image, year }) => ({ type: "saveImage", image, year }),
    }),

    deleteImage: builder.mutation<void, { image: ImageData; year: string }>({
      query: ({ image, year }) => ({ type: "deleteImage", image, year }),
    }),

    getImageUrl: builder.query<string, { id: string; year: string }>({
      query: ({ id, year }) => ({ type: "getImageUrl", id, year }),
    }),
  }),
});

export const {
  useGetConfigurationQuery,
  useGetUserDataQuery,
  useCreateProfileMutation,
  useSaveTaskByCategoryMutation,
  useSaveMoodTaskMutation,
  useRemoveTaskMutation,
  useSaveImageMutation,
  useDeleteImageMutation,
  useGetImageUrlQuery,
  useLazyGetImageUrlQuery,
} = api;
