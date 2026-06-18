import React from "react";
import { screen } from "@testing-library/react-native";
import { LoginScreen } from "../../screens/login-screen";
import { renderWithProviders } from "../utils/render";
import {
  mockSignInUserMutation,
  mockSendPasswordResetMutation,
} from "../mocks/auth-hooks";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: mockReplace,
      push: mockPush,
    }),
  };
});

jest.mock("../../services/auth-api-rtk", () => ({
  ...jest.requireActual("../../services/auth-api-rtk"),
  useSignInUserMutation: () => mockSignInUserMutation(),
  useSendPasswordResetMutation: () => mockSendPasswordResetMutation(),
}));

describe("LoginScreen", () => {
  it("renders email and password inputs", () => {
    renderWithProviders(<LoginScreen />);
    expect(
      screen.getByPlaceholderText("Введіть вашу електронну пошту")
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Введіть ваш пароль")
    ).toBeTruthy();
  });

  it("renders sign-in button", () => {
    renderWithProviders(<LoginScreen />);
    expect(screen.getByText("Увійти")).toBeTruthy();
  });

  it("renders forgot-password link", () => {
    renderWithProviders(<LoginScreen />);
    expect(screen.getByText("Забули пароль?")).toBeTruthy();
  });
});
