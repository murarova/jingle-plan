import React from "react";
import { Alert, Platform } from "react-native";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { PaywallScreen } from "../../screens/paywall-screen";
import { renderWithProviders } from "../utils/render";

const mockSubscribe = jest.fn();
const mockRedeemOfferCode = jest.fn();
const mockRestorePurchases = jest.fn();

const mockUseIAP = jest.fn(() => ({
  subscriptions: [{ id: "test.subscription" }],
  isLoading: false,
  subscribe: mockSubscribe,
  redeemOfferCode: mockRedeemOfferCode,
  restorePurchases: mockRestorePurchases,
  activeProductId: null,
  isInitialized: true,
  priceLabel: "$12.99",
  isSubscriber: false,
  isStoreReady: true,
  errorMessage: null,
  isAwaitingOfferRedemption: false,
}));

jest.mock("../../hooks/useIAP", () => ({
  useIAP: () => mockUseIAP(),
}));

describe("PaywallScreen", () => {
  const originalOs = Platform.OS;

  beforeEach(() => {
    mockSubscribe.mockReset();
    mockRedeemOfferCode.mockReset();
    mockRestorePurchases.mockReset().mockResolvedValue(true);
    mockUseIAP.mockReturnValue({
      subscriptions: [{ id: "test.subscription" }],
      isLoading: false,
      subscribe: mockSubscribe,
      redeemOfferCode: mockRedeemOfferCode,
      restorePurchases: mockRestorePurchases,
      activeProductId: null,
      isInitialized: true,
      priceLabel: "$12.99",
      isSubscriber: false,
      isStoreReady: true,
      errorMessage: null,
      isAwaitingOfferRedemption: false,
    });
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
    renderWithProviders(<PaywallScreen />);
    expect(screen.getByText("Оформити підписку")).toBeTruthy();
  });

  it("renders manage subscription link", () => {
    renderWithProviders(<PaywallScreen />);
    expect(screen.getByText("Керувати підпискою")).toBeTruthy();
  });

  it("opens the Apple offer code redemption sheet", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    renderWithProviders(<PaywallScreen />);
    fireEvent.press(screen.getByText("Маєте промокод?"));
    expect(mockRedeemOfferCode).toHaveBeenCalled();
  });

  it("hides the promo code entry on Android", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    renderWithProviders(<PaywallScreen />);
    expect(screen.queryByText("Маєте промокод?")).toBeNull();
  });

  it("hides the promo code entry for subscribers", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    mockUseIAP.mockReturnValue({
      subscriptions: [{ id: "test.subscription" }],
      isLoading: false,
      subscribe: mockSubscribe,
      redeemOfferCode: mockRedeemOfferCode,
      restorePurchases: mockRestorePurchases,
      activeProductId: "test.subscription",
      isInitialized: true,
      priceLabel: "$12.99",
      isSubscriber: true,
      isStoreReady: true,
      errorMessage: null,
      isAwaitingOfferRedemption: false,
    });
    renderWithProviders(<PaywallScreen />);
    expect(screen.queryByText("Маєте промокод?")).toBeNull();
  });

  it("shows a loader while offer redemption is finishing", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });
    mockUseIAP.mockReturnValue({
      subscriptions: [{ id: "test.subscription" }],
      isLoading: true,
      subscribe: mockSubscribe,
      redeemOfferCode: mockRedeemOfferCode,
      restorePurchases: mockRestorePurchases,
      activeProductId: null,
      isInitialized: true,
      priceLabel: "$12.99",
      isSubscriber: false,
      isStoreReady: true,
      errorMessage: null,
      isAwaitingOfferRedemption: true,
    });
    renderWithProviders(<PaywallScreen />);
    expect(screen.getByTestId("paywall-redeem-loader")).toBeTruthy();
  });

  it("restores purchases", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    renderWithProviders(<PaywallScreen />);
    fireEvent.press(screen.getByText("Відновити доступ"));
    expect(mockRestorePurchases).toHaveBeenCalled();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Відновити доступ",
        "Доступ відновлено."
      );
    });
    alertSpy.mockRestore();
  });
});
