import { createApi } from "@reduxjs/toolkit/query/react";
import { EXPO_PUBLIC_DB } from "@env";
import {
  get,
  getDatabase,
  ref,
  remove,
  set,
} from "@react-native-firebase/database";
import { getAuth } from "@react-native-firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  putFile,
  ref as storageRef,
} from "@react-native-firebase/storage";
import { TASK_CATEGORY } from "@/constants";
import { CalendarConfig, ImageData } from "@/types";

const db = getDatabase(undefined, EXPO_PUBLIC_DB);
const storage = getStorage();

function dbRef(path: string) {
  return ref(db, path);
}

const firebaseQuery = async (args: any, api: any): Promise<any> => {
  const currentUser = getAuth().currentUser;

  try {
    switch (args.type) {
      case "getConfiguration": {
        const configResponse = await get(
          dbRef(`${args.year}/configuration`)
        );
        return { data: configResponse.val() };
      }

      case "getUserData": {
        if (!args.uid || !args.year) {
          throw new Error("No user or year provided");
        }
        const userResponse = await get(
          dbRef(`/${args.year}/users/${args.uid}`)
        );
        return { data: userResponse.val() || null };
      }

      case "createProfile":
        await set(dbRef(`/usersProfiles/${args.uid}`), {
          name: args.name,
          email: args.email,
        });
        return { data: null };

      case "getUserProfile": {
        if (!currentUser) throw new Error("No user provided");
        const profileResponse = await get(
          dbRef(`/usersProfiles/${currentUser.uid}`)
        );
        return { data: profileResponse.val() || null };
      }

      case "saveTaskByCategory":
        if (!currentUser) throw new Error("No user provided");
        await set(
          dbRef(
            `/${args.year}/users/${currentUser.uid}/${args.category}/${args.context}`
          ),
          args.data
        );
        return { data: null };

      case "saveMoodTask":
        if (!currentUser) throw new Error("No user provided");
        await set(
          dbRef(
            `/${args.year}/users/${currentUser.uid}/${args.category}/${args.day}`
          ),
          args.data
        );
        return { data: args.data };

      case "removeTask": {
        if (!currentUser) throw new Error("No user provided");
        const taskPath =
          args.category === TASK_CATEGORY.MOOD
            ? `${currentUser.uid}/${args.category}/${args.day}`
            : `${currentUser.uid}/${args.category}/${args.context}`;

        await remove(dbRef(`${args.year}/users/${taskPath}`));
        return { data: null };
      }

      case "saveImage":
        if (!currentUser) throw new Error("No user provided");
        if (!args.image?.uri) {
          throw new Error("No image uri provided");
        }
        await putFile(
          storageRef(
            storage,
            `/images/${args.year}/${currentUser.uid}/${args.image.id}`
          ),
          args.image.uri
        );
        return { data: null };

      case "deleteImage":
        if (!currentUser) throw new Error("No user provided");
        await deleteObject(
          storageRef(
            storage,
            `/images/${args.year}/${currentUser.uid}/${args.image.id}`
          )
        );
        return { data: null };

      case "getImageUrl": {
        if (!currentUser) throw new Error("No user provided");
        const url = await getDownloadURL(
          storageRef(
            storage,
            `/images/${args.year}/${currentUser.uid}/${args.id}`
          )
        );
        return { data: url };
      }

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
    getConfiguration: builder.query<CalendarConfig, { year: string }>({
      query: ({ year }) => ({ type: "getConfiguration", year }),
      providesTags: ["Configuration"],
    }),

    getUserData: builder.query<any, { uid: string; year: string }>({
      query: ({ uid, year }) => ({ type: "getUserData", uid, year }),
      providesTags: ["UserData"],
    }),

    getUserProfile: builder.query<any, { uid: string }>({
      query: ({ uid }) => ({ type: "getUserProfile", uid }),
      providesTags: ["UserProfile"],
    }),

    createProfile: builder.mutation<
      void,
      { uid: string; name: string; email: string }
    >({
      query: ({ uid, name, email }) => ({
        type: "createProfile",
        uid,
        name,
        email,
      }),
      invalidatesTags: ["UserProfile"],
    }),

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
  useLazyGetUserDataQuery,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useCreateProfileMutation,
  useSaveTaskByCategoryMutation,
  useSaveMoodTaskMutation,
  useRemoveTaskMutation,
  useSaveImageMutation,
  useDeleteImageMutation,
  useGetImageUrlQuery,
  useLazyGetImageUrlQuery,
} = api;
