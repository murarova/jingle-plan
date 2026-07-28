import React from "react";
import { LoadingScreen } from "../../screens/loading-screen";
import { renderWithProviders } from "../utils/render";
import { mockNavigate, resetNavigationMocks } from "../mocks/navigation";
import { SCREENS } from "@/constants";
import type { SerializableUser } from "../../types/user";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

const mockUseCalendarDayManager = jest.fn(() => ({ isLoading: false }));

jest.mock("../../hooks/useCalendarDayManager", () => ({
  useCalendarDayManager: () => mockUseCalendarDayManager(),
}));

const testUser: SerializableUser = {
  uid: "test-uid",
  email: "test@example.com",
  emailVerified: true,
  displayName: "Test",
  phoneNumber: null,
  photoURL: null,
};

describe("LoadingScreen", () => {
  beforeEach(() => {
    resetNavigationMocks();
    mockUseCalendarDayManager.mockReturnValue({ isLoading: false });
  });

  it("renders an empty screen while resolving auth", () => {
    const { toJSON } = renderWithProviders(<LoadingScreen />, {
      withNavigation: false,
    });
    expect(toJSON()).toBeTruthy();
  });

  it("navigates to INTRO when no user is logged in", () => {
    renderWithProviders(<LoadingScreen />, { withNavigation: false });
    expect(mockNavigate).toHaveBeenCalledWith(SCREENS.INTRO);
  });

  it("navigates to HOME when a user is logged in and data is ready", () => {
    renderWithProviders(<LoadingScreen />, {
      withNavigation: false,
      preloadedState: {
        auth: {
          currentUser: testUser,
          userUid: testUser.uid,
          isLoggedIn: true,
          status: "succeeded",
          error: null,
        },
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith(SCREENS.HOME);
  });

  it("does not navigate while a logged-in user's data is still loading", () => {
    mockUseCalendarDayManager.mockReturnValue({ isLoading: true });
    renderWithProviders(<LoadingScreen />, {
      withNavigation: false,
      preloadedState: {
        auth: {
          currentUser: testUser,
          userUid: testUser.uid,
          isLoggedIn: true,
          status: "succeeded",
          error: null,
        },
      },
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
