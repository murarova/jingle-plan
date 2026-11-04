import { memo } from "react";
import { Box } from "@/ui/box";
import { Loader } from "@/components/common";
import { PaywallLayout } from "./paywall-layout";
import { IosPromoCode } from "./ios-promo-code";
import { useIosPaywall } from "./hooks/useIosPaywall";

export const IosPaywall = memo(() => {
  const {
    priceLabel,
    isSubscribeDisabled,
    isSubscriber,
    isProcessing,
    billingNote,
    isRestoreDisabled,
    showRedeemOverlay,
    isPromoDisabled,
    onSubscribe,
    onRestore,
    onManageSubscription,
    onRedeemPromo,
  } = useIosPaywall();

  return (
    <PaywallLayout
      priceLabel={priceLabel}
      isSubscribeDisabled={isSubscribeDisabled}
      isSubscriber={isSubscriber}
      isProcessing={isProcessing}
      billingNote={billingNote}
      isRestoreDisabled={isRestoreDisabled}
      onSubscribe={onSubscribe}
      onRestore={onRestore}
      onManageSubscription={onManageSubscription}
      promo={
        <IosPromoCode
          isDisabled={isPromoDisabled}
          isSubscriber={isSubscriber}
          onRedeem={onRedeemPromo}
        />
      }
      overlay={
        showRedeemOverlay ? (
          <Box
            testID="paywall-redeem-loader"
            className="absolute left-0 right-0 top-0 bottom-0 z-10"
          >
            <Loader absolute />
          </Box>
        ) : null
      }
    />
  );
});

IosPaywall.displayName = "IosPaywall";
