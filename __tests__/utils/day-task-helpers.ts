import type { ImageData } from "@/types";
import type { RootState } from "../../store/store";
import type { SerializableUser } from "../../types/user";

export const testUser: SerializableUser = {
  uid: "test-uid",
  email: "test@example.com",
  emailVerified: true,
  displayName: "Test User",
  phoneNumber: null,
  photoURL: null,
};

export const loggedInPreloadedState: Partial<RootState> = {
  auth: {
    currentUser: testUser,
    userUid: testUser.uid,
    isLoggedIn: true,
    status: "succeeded",
    error: null,
  },
  app: {
    selectedYear: "2025",
    configuration: null,
    status: "idle",
    error: null,
  },
};

export let mockImage: ImageData | null = null;

export const mockSetImage = jest.fn((image: ImageData | null) => {
  mockImage = image;
});

export const mockSaveImageFn = jest.fn(() =>
  Promise.resolve("https://example.com/image.jpg")
);

export const mockSetIsLoading = jest.fn();

export const mockUseImage = jest.fn(() => ({
  saveImage: mockSaveImageFn,
  setImage: mockSetImage,
  get image() {
    return mockImage;
  },
  isLoading: false,
  setIsLoading: mockSetIsLoading,
}));

export const resetImageMock = () => {
  mockImage = null;
  mockSetImage.mockClear();
  mockSaveImageFn.mockClear();
  mockSetIsLoading.mockClear();
  mockUseImage.mockClear();
};

export const testImage: ImageData = {
  id: "img-1",
  uri: "file://photo.jpg",
  width: 100,
  height: 100,
};
