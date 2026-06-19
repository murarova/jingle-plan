import * as functions from "firebase-functions/v1";
import { defineSecret, defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  runDecemberDailyNotifications,
  runMonthlyNotifications,
} from "./notifications";

const DATABASE_URL =
  "https://advent-calendar-12-default-rtdb.europe-west1.firebasedatabase.app";

initializeApp({ databaseURL: DATABASE_URL });

const applePrivateKey = defineSecret("IAP_APPLE_PRIVATE_KEY");
const appleIssuerId = defineString("IAP_APPLE_ISSUER_ID");
const appleKeyId = defineString("IAP_APPLE_KEY_ID");

export const sendMonthlyNotifications = functions
  .region("us-central1")
  .pubsub.schedule("0 11 1 * *")
  .timeZone("Europe/Kyiv")
  .onRun(async () => {
    await runMonthlyNotifications();
  });

export const sendDecemberDailyNotifications = functions
  .region("us-central1")
  .pubsub.schedule("0 11 1-31 12 *")
  .timeZone("Europe/Kyiv")
  .onRun(async () => {
    await runDecemberDailyNotifications();
  });

const APPLE_API_BASE = "https://api.storekit.itunes.apple.com/inApps/v1";
const APPLE_TEST_API_BASE =
  "https://api.storekit-sandbox.itunes.apple.com/inApps/v1";

const getAppStoreToken = (): string => {
  const privateKey = applePrivateKey.value().replace(/\\n/g, "\n");
  const issuerId = appleIssuerId.value();
  const keyId = appleKeyId.value();

  if (!privateKey || !issuerId || !keyId) {
    throw new Error(
      "Missing IAP params: IAP_APPLE_PRIVATE_KEY, IAP_APPLE_ISSUER_ID, IAP_APPLE_KEY_ID",
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: issuerId,
    iat: now,
    exp: now + 60 * 5,
    aud: "appstoreconnect-v1",
  };

  return jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    header: {
      alg: "ES256",
      kid: keyId,
      typ: "JWT",
    },
  });
};

const buildAppleUrl = (path: string, useSandbox: boolean) => {
  const base = useSandbox ? APPLE_TEST_API_BASE : APPLE_API_BASE;
  return `${base}/${path}`;
};

export const validateSubscription = functions
  .runWith({ secrets: [applePrivateKey] })
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const {
      transactionId,
      receipt,
      environment = "production",
      uid,
    } = req.body ?? {};

    if (!transactionId && !receipt) {
      res.status(400).send("Missing transactionId or receipt");
      return;
    }

    try {
      const token = getAppStoreToken();
      const useSandbox = environment === "sandbox";
      let responseData: unknown;

      if (transactionId) {
        const url = buildAppleUrl(`subscriptions/${transactionId}`, useSandbox);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        responseData = response.data;
      } else {
        const url = buildAppleUrl("receipts/verify", useSandbox);
        const response = await axios.post(
          url,
          { receiptData: receipt },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        responseData = response.data;
      }

      if (uid) {
        await getFirestore().collection("iapEntitlements").doc(uid).set(
          {
            updatedAt: FieldValue.serverTimestamp(),
            transactionId,
            environment,
            receiptStatus: "valid",
            payload: responseData,
          },
          { merge: true },
        );
      }

      res.status(200).json({ success: true, payload: responseData });
    } catch (error) {
      console.error("Validation error", error);

      if (uid) {
        await getFirestore()
          .collection("iapEntitlements")
          .doc(uid)
          .set(
            {
              updatedAt: FieldValue.serverTimestamp(),
              transactionId,
              environment,
              receiptStatus: "invalid",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
            },
            { merge: true },
          );
      }

      res
        .status(500)
        .send(
          error instanceof Error
            ? error.message
            : "Failed to validate subscription",
        );
    }
  });
