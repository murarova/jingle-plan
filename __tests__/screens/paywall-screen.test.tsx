import React from "react";
import { Alert, Platform } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { PaywallScreen } from "../../screens/paywall-screen";
import { renderWithProviders } from "../utils/render";

const mockSubscribe = jest.fn();
const mockRedeemAppleOfferCode = jest.fn();
const mockRedeemAndroidPromoCode = jest.fn();
const mockClearErrorMessage = jest.fn();
const mockClearPromoError = jest.fn();
const mockRestorePurchases = jest.fn();

const defaultIap = {
  subscriptions: [{ id: "test.subscription" }],
  isLoading: false,
  subscribe: mockSubscribe,
  redeemAppleOfferCode: mockRedeemAppleOfferCode,
  redeemAndroidPromoCode: mockRedeemAndroidPromoCode,
  clearErrorMessage: mockClearErrorMessage,
  clearPromoError: mockClearPromoError,
  restorePurchases: mockRestorePurchases,
  activeProductId: null,
  isInitialized: true,
  priceLabel: "$12.99",
  isSubscriber: false,
  isStoreReady: true,
  errorMessage: null,
  promoErrorMessage: null,
  isAwaitingOfferRedemption: false,
};

const mockUseIAP = jest.fn(() => defaultIap);

jest.mock("@/hooks/useIAP", () => ({
  useIAP: () => mockUseIAP(),
}));

describe("PaywallScreen", () => {
  const originalOs = Platform.OS;

  beforeEach(() => {
    mockSubscribe.mockReset();
    mockRedeemAppleOfferCode.mockReset();
    mockRedeemAndroidPromoCode.mockReset();
    mockClearErrorMessage.mockReset();
    mockClearPromoError.mockReset();
    mockRestorePurchases.mockReset().mockResolvedValue(true);
    mockUseIAP.mockReturnValue({ ...defaultIap });
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

  it("renders subscribe CTA", () => {
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.getByText("Оформити підписку")).toBeTruthy();
  });

  it("shows the store price instead of a hardcoded amount", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      priceLabel: "₴499.00",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.getByText("₴499.00")).toBeTruthy();
    expect(screen.queryByText("$12.99")).toBeNull();
  });

  it("does not show a hardcoded price when the store price is missing", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      priceLabel: null,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("$12.99")).toBeNull();
  });

  it("renders manage subscription link", () => {
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.getByText("Керувати підпискою")).toBeTruthy();
  });

  it("opens the Apple offer code redemption sheet without a typed code", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Маєте промокод?"));
    expect(mockRedeemAppleOfferCode).toHaveBeenCalledWith();
    expect(mockRedeemAndroidPromoCode).not.toHaveBeenCalled();
  });

  it("opens a promo code modal on Android and redeems a typed code", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockRedeemAndroidPromoCode.mockResolvedValue(false);
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByTestId("paywall-promo-input")).toBeNull();
    fireEvent.press(screen.getByText("Маєте промокод?"));
    fireEvent.changeText(
      screen.getByTestId("paywall-promo-input"),
      "ABCD-EFGHJK",
    );
    fireEvent.press(screen.getByTestId("paywall-promo-redeem"));
    await waitFor(() => {
      expect(mockRedeemAndroidPromoCode).toHaveBeenCalledWith("ABCD-EFGHJK");
    });
    expect(mockRedeemAppleOfferCode).not.toHaveBeenCalled();
  });

  it("shows Android promo errors only in the modal", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      errorMessage: "Store failed",
      promoErrorMessage: "Цей промокод недійсний.",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.getByText("Store failed")).toBeTruthy();
    expect(screen.queryByText("Цей промокод недійсний.")).toBeNull();
    fireEvent.press(screen.getByText("Маєте промокод?"));
    expect(screen.getAllByText("Цей промокод недійсний.")).toHaveLength(1);
  });

  it("clears the store error when the screen is left", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      errorMessage: "Store failed",
    });
    const { unmount } = renderWithProviders(<PaywallScreen />, {
      withNavigation: true,
    });
    expect(screen.getByText("Store failed")).toBeTruthy();
    expect(mockClearErrorMessage).not.toHaveBeenCalled();
    unmount();
    expect(mockClearErrorMessage).toHaveBeenCalled();
  });

  it("clears Android promo errors when the modal opens", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Маєте промокод?"));
    expect(mockClearPromoError).toHaveBeenCalled();
  });

  it("does not show the Apple redemption overlay for an Android promo", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isAwaitingOfferRedemption: false,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Маєте промокод?"));
    expect(screen.queryByTestId("paywall-redeem-loader")).toBeNull();
  });

  it("hides the promo code entry for subscribers", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      activeProductId: "test.subscription",
      isSubscriber: true,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("Маєте промокод?")).toBeNull();
    expect(screen.queryByTestId("paywall-promo-input")).toBeNull();
  });

  it("shows a loader while offer redemption is finishing", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isLoading: true,
      isAwaitingOfferRedemption: true,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.getByTestId("paywall-redeem-loader")).toBeTruthy();
  });

  it("restores purchases", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Відновити доступ"));
    expect(mockRestorePurchases).toHaveBeenCalled();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Відновити доступ",
        "Доступ відновлено.",
      );
    });
    alertSpy.mockRestore();
  });

  it("keeps Android restore available when the store is not ready", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isInitialized: false,
      isStoreReady: false,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Відновити доступ"));
    expect(mockRestorePurchases).toHaveBeenCalled();
  });
});
