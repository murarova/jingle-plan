import React from "react";
import { Alert } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { LoginScreen } from "../../screens/login-screen";
import { renderWithProviders } from "../utils/render";
import {
  mockSignInUserMutation,
  mockSendPasswordResetMutation,
  signInTrigger,
  sendPasswordResetTrigger,
  resetAuthHookMocks,
} from "../mocks/auth-hooks";
import { mockReplace, resetNavigationMocks } from "../mocks/navigation";
import { SCREENS } from "../../constants/constants";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

jest.mock("../../services/auth-api-rtk", () => ({
  ...jest.requireActual("../../services/auth-api-rtk"),
  useSignInUserMutation: () => mockSignInUserMutation(),
  useSendPasswordResetMutation: () => mockSendPasswordResetMutation(),
}));

const EMAIL_PLACEHOLDER = "Введіть вашу електронну пошту";
const PASSWORD_PLACEHOLDER = "Введіть ваш пароль";

const fillCredentials = (
  email = "user@example.com",
  password = "Password1"
) => {
  fireEvent.changeText(screen.getByPlaceholderText(EMAIL_PLACEHOLDER), email);
  fireEvent.changeText(
    screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
    password
  );
};

describe("LoginScreen", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetNavigationMocks();
    resetAuthHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("rendering", () => {
    it("renders email and password inputs", () => {
      renderWithProviders(<LoginScreen />);
      expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER)).toBeTruthy();
    });

    it("renders sign-in and forgot-password actions", () => {
      renderWithProviders(<LoginScreen />);
      expect(screen.getByText("Увійти")).toBeTruthy();
      expect(screen.getByText("Забули пароль?")).toBeTruthy();
    });
  });

  describe("email validation", () => {
    it("shows an error when an invalid email is blurred", () => {
      renderWithProviders(<LoginScreen />);
      const emailInput = screen.getByPlaceholderText(EMAIL_PLACEHOLDER);
      fireEvent.changeText(emailInput, "not-an-email");
      fireEvent(emailInput, "blur");
      expect(
        screen.getByText("Будь ласка, введіть дійсну електронну адресу")
      ).toBeTruthy();
    });

    it("clears the error when the field is focused again", () => {
      renderWithProviders(<LoginScreen />);
      const emailInput = screen.getByPlaceholderText(EMAIL_PLACEHOLDER);
      fireEvent.changeText(emailInput, "not-an-email");
      fireEvent(emailInput, "blur");
      fireEvent(emailInput, "focus");
      expect(
        screen.queryByText("Будь ласка, введіть дійсну електронну адресу")
      ).toBeNull();
    });
  });

  describe("sign in", () => {
    it("submits credentials, stores the user and navigates home", async () => {
      const { store } = renderWithProviders(<LoginScreen />);
      fillCredentials();

      fireEvent.press(screen.getByText("Увійти"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(SCREENS.HOME);
      });
      expect(signInTrigger).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "Password1",
      });
      expect(store.getState().auth.isLoggedIn).toBe(true);
      expect(store.getState().auth.currentUser?.uid).toBe("test-uid");
    });

    it("records an auth error and alerts when sign-in fails", async () => {
      signInTrigger.mockImplementationOnce(() => ({
        unwrap: () => Promise.reject(new Error("Invalid credentials")),
      }));

      const { store } = renderWithProviders(<LoginScreen />);
      fillCredentials();

      fireEvent.press(screen.getByText("Увійти"));

      await waitFor(() => {
        expect(store.getState().auth.error).toBe("Invalid credentials");
      });
      expect(store.getState().auth.status).toBe("failed");
      expect(alertSpy).toHaveBeenCalledWith("Помилка", "Invalid credentials");
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("password reset", () => {
    it("blocks reset and alerts when email is empty", async () => {
      renderWithProviders(<LoginScreen />);

      fireEvent.press(screen.getByText("Забули пароль?"));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Помилка",
          "Введіть вашу електронну адресу, щоб отримати інструкції."
        );
      });
      expect(sendPasswordResetTrigger).not.toHaveBeenCalled();
    });

    it("sends a reset request for a valid email", async () => {
      renderWithProviders(<LoginScreen />);
      fireEvent.changeText(
        screen.getByPlaceholderText(EMAIL_PLACEHOLDER),
        "user@example.com"
      );

      fireEvent.press(screen.getByText("Забули пароль?"));

      await waitFor(() => {
        expect(sendPasswordResetTrigger).toHaveBeenCalledWith({
          email: "user@example.com",
        });
      });
      expect(alertSpy).toHaveBeenCalledWith(
        "Виконано",
        "Ми надіслали інструкції для відновлення на user@example.com."
      );
    });
  });
});
