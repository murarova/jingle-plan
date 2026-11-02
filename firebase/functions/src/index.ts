import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import {
  runDecemberDailyNotifications,
  runMonthlyNotifications,
} from "./notifications";
import {
  generateAndroidPromoCodes,
  redeemAndroidPromoCode,
  getAndroidPromoEntitlement,
} from "./android-promo-http";
import { deleteUserData } from "./delete-user-data";

const DATABASE_URL =
  "https://advent-calendar-12-default-rtdb.europe-west1.firebasedatabase.app";

initializeApp({
  databaseURL: DATABASE_URL,
  storageBucket: "advent-calendar-12.appspot.com",
});

export const sendMonthlyNotifications = functions
  .region("us-central1")
  .pubsub.schedule("0 11 1 * *")
  .timeZone("Europe/Kyiv")
  .onRun(async () => {
    await runMonthlyNotifications();
  });

export const sendDecemberDailyNotifications = functions
  .region("us-central1")
  //TODO: Change to the actual schedule
  // .pubsub.schedule("0 11 1-31 12 *")
  .pubsub.schedule("0 11 20-30 6 *")
  .timeZone("Europe/Kyiv")
  .onRun(async () => {
    await runDecemberDailyNotifications();
  });

export {
  generateAndroidPromoCodes,
  redeemAndroidPromoCode,
  getAndroidPromoEntitlement,
};

export { deleteUserData };
