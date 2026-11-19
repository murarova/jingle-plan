import React from "react";
import { Alert, Linking, Platform } from "react-native";
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

  it("shows Android promo errors in an alert", async () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockRedeemAndroidPromoCode.mockRejectedValue(
      new Error("Цей промокод недійсний."),
    );
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Маєте промокод?"));
    fireEvent.changeText(
      screen.getByTestId("paywall-promo-input"),
      "ABCD-EFGHJK",
    );
    fireEvent.press(screen.getByTestId("paywall-promo-redeem"));
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Помилка",
        "Цей промокод недійсний.",
      );
    });
    alertSpy.mockRestore();
  });

  it("shows store errors in an alert", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      errorMessage: "Store failed",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Помилка", "Store failed");
    });
    expect(screen.queryByText("Store failed")).toBeNull();
    expect(mockClearErrorMessage).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("clears the store error when the screen is left", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      errorMessage: "Store failed",
    });
    const { unmount } = renderWithProviders(<PaywallScreen />, {
      withNavigation: true,
    });
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

  it("hides the subscribe button and shows the active status for subscribers", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      activeProductId: "test.subscription",
      isSubscriber: true,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("Оформити підписку")).toBeNull();
    expect(screen.getByText("Підписка активна")).toBeTruthy();
    expect(screen.getByText("Керувати підпискою")).toBeTruthy();
  });

  it("subscribes with the store product when the button is pressed", () => {
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    fireEvent.press(screen.getByText("Оформити підписку"));
    expect(mockSubscribe).toHaveBeenCalledWith("test.subscription");
  });

  it("points Android users to the website while Google Play billing is hidden", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    const openUrl = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValue(undefined as never);
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText(/Google Play/)).toBeNull();
    expect(screen.queryByText("Відновити покупки")).toBeNull();
    expect(screen.queryByText("Керувати підпискою")).toBeNull();
    expect(screen.getByText("599.99 грн")).toBeTruthy();
    expect(
      screen.getByText(
        'Оформити підписку можна на офіційному сайті "Jingle Plan".',
      ),
    ).toBeTruthy();
    fireEvent.press(screen.getByText("Оформити підписку"));
    expect(openUrl).toHaveBeenCalledWith("https://jingle-plan.app/subscribe/");
    expect(mockSubscribe).not.toHaveBeenCalled();
    openUrl.mockRestore();
  });

  it("hides the billing note when access comes from a promo code", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isSubscriber: true,
      activeProductId: null,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText(/Оплата через/)).toBeNull();
  });

  it("hides store subscription management for a website year on Android", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isSubscriber: true,
      activeProductId: null,
      priceLabel: "₴599.99",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("Керувати підпискою")).toBeNull();
    expect(screen.queryByText("Відновити покупки")).toBeNull();
    expect(screen.queryByText("₴599.99")).toBeNull();
    expect(screen.queryByText("599.99 грн")).toBeNull();
    expect(screen.queryByText("Оформити підписку")).toBeNull();
    expect(
      screen.queryByText(
        'Оформити підписку можна на офіційному сайті "Jingle Plan".',
      ),
    ).toBeNull();
    expect(screen.queryByText(/Google Play/)).toBeNull();
    expect(screen.getByText("Підписка активна")).toBeTruthy();
  });

  it("hides Google Play management for an Android Play subscription", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isSubscriber: true,
      activeProductId: "test.subscription",
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("Керувати підпискою")).toBeNull();
    expect(screen.queryByText(/Google Play/)).toBeNull();
    expect(screen.queryByText("599.99 грн")).toBeNull();
    expect(screen.queryByText("Оформити підписку")).toBeNull();
    expect(
      screen.queryByText(
        'Оформити підписку можна на офіційному сайті "Jingle Plan".',
      ),
    ).toBeNull();
    expect(screen.getByText("Підписка активна")).toBeTruthy();
  });

  it("hides store subscription management for a website year", () => {
    mockUseIAP.mockReturnValue({
      ...defaultIap,
      isSubscriber: true,
      activeProductId: null,
    });
    renderWithProviders(<PaywallScreen />, { withNavigation: true });
    expect(screen.queryByText("Керувати підпискою")).toBeNull();
    expect(screen.queryByText("Відновити покупки")).toBeNull();
    expect(screen.queryByText("$12.99")).toBeNull();
    expect(screen.queryByText(/Apple ID/)).toBeNull();
    expect(screen.getByText("Підписка активна")).toBeTruthy();
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
    fireEvent.press(screen.getByText("Відновити покупки"));
    expect(mockRestorePurchases).toHaveBeenCalled();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Відновити покупки",
        "Доступ відновлено.",
      );
    });
    alertSpy.mockRestore();
  });

  it("hides Android restore while Google Play billing is hidden", () => {
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
    expect(screen.queryByText("Відновити покупки")).toBeNull();
    expect(screen.getByText("Оформити підписку")).toBeTruthy();
  });
});
