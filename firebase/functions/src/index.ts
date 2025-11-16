import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import jwt from "jsonwebtoken";

admin.initializeApp();

const APPLE_API_BASE = "https://api.storekit.itunes.apple.com/inApps/v1";
const APPLE_TEST_API_BASE = "https://api.storekit-sandbox.itunes.apple.com/inApps/v1";

const getConfigValue = (key: string) => {
  const value = functions.config()?.iap?.[key];
  if (!value) {
    throw new Error(`Missing functions config value: iap.${key}`);
  }
  return value as string;
};

const getAppStoreToken = (): string => {
  const privateKey = getConfigValue("apple_private_key").replace(/\\n/g, "\n");
  const issuerId = getConfigValue("apple_issuer_id");
  const keyId = getConfigValue("apple_key_id");

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
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { transactionId, receipt, environment = "production", uid } = req.body ?? {};

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
          }
        );
        responseData = response.data;
      }

      if (uid) {
        await admin.firestore().collection("iapEntitlements").doc(uid).set(
          {
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            transactionId,
            environment,
            receiptStatus: "valid",
            payload: responseData,
          },
          { merge: true }
        );
      }

      res.status(200).json({ success: true, payload: responseData });
    } catch (error) {
      console.error("Validation error", error);

      if (uid) {
        await admin.firestore().collection("iapEntitlements").doc(uid).set(
          {
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            transactionId,
            environment,
            receiptStatus: "invalid",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          },
          { merge: true }
        );
      }

      res.status(500).send(
        error instanceof Error ? error.message : "Failed to validate subscription"
      );
    }
  });

