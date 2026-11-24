import React from "react";
import { Alert, Platform } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { AppMenu } from "../../components/navigation/app-menu";
import { renderWithProviders } from "../utils/render";
import { openPlayStoreListing } from "../../utils/open-play-store";

jest.mock("../../utils/open-play-store", () => ({
  openPlayStoreListing: jest.fn(() => Promise.resolve()),
}));

const mockOpenPlayStoreListing = openPlayStoreListing as jest.Mock;

describe("AppMenu", () => {
  const originalOs = Platform.OS;

  beforeEach(() => {
    mockOpenPlayStoreListing.mockClear();
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => originalOs,
    });
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => originalOs,
    });
  });

  function openMenu() {
    fireEvent.press(screen.getByTestId("app-menu-trigger"));
  }

  it("opens the Play Store listing from the Android menu", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });

    renderWithProviders(<AppMenu />, { withNavigation: true });
    openMenu();
    fireEvent.press(screen.getByText("Оцінити застосунок"));

    expect(mockOpenPlayStoreListing).toHaveBeenCalledTimes(1);
  });

  it("shows an error when the Play Store listing cannot be opened", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockOpenPlayStoreListing.mockRejectedValueOnce(new Error("unavailable"));
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    renderWithProviders(<AppMenu />, { withNavigation: true });
    openMenu();
    fireEvent.press(screen.getByText("Оцінити застосунок"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Помилка", "unavailable");
    });
    alertSpy.mockRestore();
  });

  it("does not offer rating on iOS", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });

    renderWithProviders(<AppMenu />, { withNavigation: true });
    openMenu();

    expect(screen.queryByText("Оцінити застосунок")).toBeNull();
    expect(screen.getByText("Вийти")).toBeTruthy();
  });
});
