import { memo } from "react";
import { PaywallLayout } from "./paywall-layout";
import { AndroidPromoCode } from "./android-promo-code";
import { useAndroidPaywall } from "./hooks/useAndroidPaywall";

export const AndroidPaywall = memo(() => {
  const {
    priceLabel,
    subscribeButtonLabel,
    isSubscribeDisabled,
    isSubscriber,
    isProcessing,
    errorMessage,
    disclaimer,
    isRestoreDisabled,
    isPromoDisabled,
    promoCode,
    isPromoModalOpen,
    isRedeemingPromo,
    promoErrorMessage,
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
      subscribeButtonLabel={subscribeButtonLabel}
      isSubscribeDisabled={isSubscribeDisabled}
      isSubscriber={isSubscriber}
      isProcessing={isProcessing}
      errorMessage={errorMessage}
      disclaimer={disclaimer}
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
          promoErrorMessage={promoErrorMessage}
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
