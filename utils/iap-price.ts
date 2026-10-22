type StorePricingPhase = {
  formattedPrice?: string | null;
};

type StorePriceSource = {
  displayPrice?: string | null;
  subscriptionOffers?: Array<{
    displayPrice?: string | null;
    pricingPhasesAndroid?: {
      pricingPhaseList?: StorePricingPhase[];
    } | null;
  }> | null;
  subscriptionOfferDetailsAndroid?: Array<{
    pricingPhases?: {
      pricingPhaseList?: StorePricingPhase[];
    };
  }> | null;
};

function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | null {
  return (
    values.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ?? null
  );
}

export function getStorePriceLabel(
  product: StorePriceSource | null | undefined,
): string | null {
  if (!product) return null;

  const offer = product.subscriptionOffers?.[0];
  const phases =
    offer?.pricingPhasesAndroid?.pricingPhaseList ??
    product.subscriptionOfferDetailsAndroid?.[0]?.pricingPhases
      ?.pricingPhaseList;
  const recurringAndroidPrice = phases?.at(-1)?.formattedPrice;

  return firstNonEmpty(
    recurringAndroidPrice,
    offer?.displayPrice,
    product.displayPrice,
  );
}
