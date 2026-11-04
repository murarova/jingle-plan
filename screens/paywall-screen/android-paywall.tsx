import { memo } from "react";
import { PaywallLayout } from "./paywall-layout";
import { AndroidPromoCode } from "./android-promo-code";
import { useAndroidPaywall } from "./hooks/useAndroidPaywall";

export const AndroidPaywall = memo(() => {
  const {
    priceLabel,
    isSubscribeDisabled,
    isSubscriber,
    isProcessing,
    billingNote,
    isRestoreDisabled,
    isPromoDisabled,
    promoCode,
    isPromoModalOpen,
    isRedeemingPromo,
    onChangePromoCode,
    onSubscribe,
    onRestore,
    onManageSubscription,
    onOpenPromoModal,
    onClosePromoModal,
    onRedeemPromo,
  } = useAndroidPaywall();

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
        <AndroidPromoCode
          isDisabled={isPromoDisabled}
          isSubscriber={isSubscriber}
          code={promoCode}
          isModalOpen={isPromoModalOpen}
          isRedeeming={isRedeemingPromo}
          onChangeCode={onChangePromoCode}
          onOpen={onOpenPromoModal}
          onClose={onClosePromoModal}
          onRedeem={() => {
            void onRedeemPromo();
          }}
        />
      }
    />
  );
});

AndroidPaywall.displayName = "AndroidPaywall";
