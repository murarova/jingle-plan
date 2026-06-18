import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import {
  syncPremiumTopicSubscription,
  updateFcmEligibility,
} from "../services/messaging";

export function useFcmEligibilitySync(
  isSubscriber: boolean,
  isAdmin: boolean,
  isSubscriptionResolved: boolean
) {
  useEffect(() => {
    if (!isSubscriptionResolved || !auth().currentUser) {
      return;
    }

    const isEligible = isSubscriber || isAdmin;

    updateFcmEligibility({ isSubscriber, isAdmin });
    syncPremiumTopicSubscription(isEligible);
  }, [isSubscriber, isAdmin, isSubscriptionResolved]);
}
