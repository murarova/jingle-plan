import React from "react";
import { screen } from "@testing-library/react-native";
import { RegisterScreen } from "../../screens/register-screen";
import { renderWithProviders } from "../utils/render";
import {
  mockCreateUserMutation,
} from "../mocks/auth-hooks";
import { mockCreateProfileMutation } from "../mocks/api-hooks";

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
  useCreateUserMutation: () => mockCreateUserMutation(),
}));

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useCreateProfileMutation: () => mockCreateProfileMutation(),
}));

describe("RegisterScreen", () => {
  it("renders registration form fields", () => {
    renderWithProviders(<RegisterScreen />);
    expect(screen.getByText("Ім'я")).toBeTruthy();
    expect(screen.getByText("Пошта")).toBeTruthy();
    expect(screen.getAllByText("Пароль").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Повторіть пароль")).toBeTruthy();
  });

  it("renders create account button", () => {
    renderWithProviders(<RegisterScreen />);
    expect(screen.getByText("Створити акаунт")).toBeTruthy();
  });
});
