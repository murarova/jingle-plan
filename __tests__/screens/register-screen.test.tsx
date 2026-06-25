import React from "react";
import { Alert, AlertButton } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { RegisterScreen } from "../../screens/register-screen";
import { renderWithProviders } from "../utils/render";
import {
  mockCreateUserMutation,
  createUserTrigger,
  resetAuthHookMocks,
} from "../mocks/auth-hooks";
import {
  mockCreateProfileMutation,
  createProfileTrigger,
  resetApiHookMocks,
} from "../mocks/api-hooks";
import { mockReplace, resetNavigationMocks } from "../mocks/navigation";
import { SCREENS } from "../../constants/constants";

jest.mock("@react-navigation/native", () =>
  require("../mocks/navigation").mockNavigationModule()
);

jest.mock("../../services/auth-api-rtk", () => ({
  ...jest.requireActual("../../services/auth-api-rtk"),
  useCreateUserMutation: () => mockCreateUserMutation(),
}));

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useCreateProfileMutation: () => mockCreateProfileMutation(),
}));

const NAME_PLACEHOLDER = "Ім'я";
const EMAIL_PLACEHOLDER = "Пошта";
const PASSWORD_PLACEHOLDER = "Пароль";
const REPEAT_PLACEHOLDER = "Повторіть пароль";

const fillForm = ({
  name = "Anna",
  email = "anna@example.com",
  password = "Password1",
  repeat = "Password1",
}: Partial<{
  name: string;
  email: string;
  password: string;
  repeat: string;
}> = {}) => {
  fireEvent.changeText(screen.getByPlaceholderText(NAME_PLACEHOLDER), name);
  fireEvent.changeText(screen.getByPlaceholderText(EMAIL_PLACEHOLDER), email);
  fireEvent.changeText(
    screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
    password
  );
  fireEvent.changeText(
    screen.getByPlaceholderText(REPEAT_PLACEHOLDER),
    repeat
  );
};

describe("RegisterScreen", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    resetNavigationMocks();
    resetAuthHookMocks();
    resetApiHookMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("rendering", () => {
    it("renders the form fields and submit button", () => {
      renderWithProviders(<RegisterScreen />);
      expect(screen.getByPlaceholderText(NAME_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByPlaceholderText(REPEAT_PLACEHOLDER)).toBeTruthy();
      expect(screen.getByText("Створити акаунт")).toBeTruthy();
    });
  });

  describe("validation", () => {
    it("shows a password error for a weak password", () => {
      renderWithProviders(<RegisterScreen />);
      fireEvent.changeText(
        screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
        "weak"
      );
      expect(
        screen.getByText(
          "Пароль має складатись із щонайменше 8 символів і містити хоча б одну цифру та хоча б одну велику літеру"
        )
      ).toBeTruthy();
    });

    it("shows a mismatch error when passwords differ", () => {
      renderWithProviders(<RegisterScreen />);
      fireEvent.changeText(
        screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
        "Password1"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText(REPEAT_PLACEHOLDER),
        "Password2"
      );
      expect(screen.getByText("Паролі не збігаються")).toBeTruthy();
    });

    it("shows a name error when name is blurred empty", () => {
      renderWithProviders(<RegisterScreen />);
      const nameInput = screen.getByPlaceholderText(NAME_PLACEHOLDER);
      fireEvent.changeText(nameInput, "   ");
      fireEvent(nameInput, "blur");
      expect(screen.getByText("Ім'я обов'язкове")).toBeTruthy();
    });

    it("does not submit when validation errors are present", () => {
      renderWithProviders(<RegisterScreen />);
      fillForm({ password: "weak", repeat: "weak" });
      fireEvent.press(screen.getByText("Створити акаунт"));
      expect(createUserTrigger).not.toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    it("creates the user and profile, then navigates home", async () => {
      alertSpy.mockImplementation(
        (_title?: string, _msg?: string, buttons?: AlertButton[]) => {
          buttons?.[1]?.onPress?.();
        }
      );

      const { store } = renderWithProviders(<RegisterScreen />);
      fillForm();

      fireEvent.press(screen.getByText("Створити акаунт"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(SCREENS.HOME);
      });
      expect(createUserTrigger).toHaveBeenCalledWith({
        email: "anna@example.com",
        password: "Password1",
      });
      expect(createProfileTrigger).toHaveBeenCalledWith({
        uid: "new-uid",
        name: "Anna",
        email: "test@example.com",
      });
      expect(store.getState().auth.isLoggedIn).toBe(true);
    });

    it("records an auth error and alerts when creation fails", async () => {
      createUserTrigger.mockImplementationOnce(() => ({
        unwrap: () => Promise.reject(new Error("Email already in use")),
      }));

      const { store } = renderWithProviders(<RegisterScreen />);
      fillForm();

      fireEvent.press(screen.getByText("Створити акаунт"));

      await waitFor(() => {
        expect(store.getState().auth.error).toBe("Email already in use");
      });
      expect(store.getState().auth.status).toBe("failed");
      expect(alertSpy).toHaveBeenCalledWith("Помилка", "Email already in use");
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
