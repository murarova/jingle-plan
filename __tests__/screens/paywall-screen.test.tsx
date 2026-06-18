import React from "react";
import { screen } from "@testing-library/react-native";
import { PaywallScreen } from "../../screens/paywall-screen";
import { renderWithProviders } from "../utils/render";

jest.mock("../../hooks/useIAP", () => ({
  useIAP: () => ({
    subscriptions: [{ id: "test.subscription" }],
    isLoading: false,
    subscribe: jest.fn(),
    activeProductId: null,
    isInitialized: true,
    priceLabel: "$12.99",
    isSubscriber: false,
    isStoreReady: true,
  }),
}));

describe("PaywallScreen", () => {
  it("renders subscribe CTA", () => {
    renderWithProviders(<PaywallScreen />);
    expect(screen.getByText("Оформити підписку")).toBeTruthy();
  });

  it("renders manage subscription link", () => {
    renderWithProviders(<PaywallScreen />);
    expect(screen.getByText("Керувати підпискою")).toBeTruthy();
  });
});
