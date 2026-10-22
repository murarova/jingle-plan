import { getStorePriceLabel } from "../../utils/iap-price";

describe("getStorePriceLabel", () => {
  it("returns null when no product is available", () => {
    expect(getStorePriceLabel(undefined)).toBeNull();
    expect(getStorePriceLabel(null)).toBeNull();
  });

  it("uses the store display price", () => {
    expect(getStorePriceLabel({ displayPrice: "€14.99" })).toBe("€14.99");
  });

  it("prefers the Android recurring offer price", () => {
    expect(
      getStorePriceLabel({
        displayPrice: "$0.00",
        subscriptionOffers: [
          {
            displayPrice: "Free",
            pricingPhasesAndroid: {
              pricingPhaseList: [
                { formattedPrice: "Free" },
                { formattedPrice: "₴499.00" },
              ],
            },
          },
        ],
      }),
    ).toBe("₴499.00");
  });
});
