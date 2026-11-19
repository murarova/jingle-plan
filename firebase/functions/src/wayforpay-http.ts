import * as functions from "firebase-functions/v1";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import {
  acceptBody,
  buildPurchase,
  claimPendingWeb,
  createOrderReference,
  decideServiceAction,
  isSafeOrderReference,
  nextWebGrant,
  publicOrderView,
  normalizeEmail,
  pendingKey,
  readServicePayload,
  refundWebGrant,
  verifyServiceSignature,
  YEAR_PASS_AMOUNT,
  YEAR_PASS_CURRENCY,
  type EntitlementNode,
  type WayforpayOrderStatus,
} from "./wayforpay";

const CHECKOUT_ORIGINS = new Set([
  "https://jingle-plan.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const SECRETS = ["WAYFORPAY_MERCHANT_ACCOUNT", "WAYFORPAY_MERCHANT_SECRET"];

type OrderNode = {
  email?: string;
  status?: WayforpayOrderStatus;
  uid?: string | null;
};

function merchantConfig(): { account: string; secret: string } | null {
  const account = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
  const secret = process.env.WAYFORPAY_MERCHANT_SECRET;
  if (!account || !secret) return null;
  return { account, secret };
}

function setCheckoutCors(req: functions.Request, res: functions.Response) {
  const origin = req.get("origin");
  if (origin && CHECKOUT_ORIGINS.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

function keepNode(current: EntitlementNode | null): EntitlementNode | undefined {
  return current === null ? undefined : current;
}

async function findUid(email: string): Promise<string | null> {
  try {
    const user = await getAuth().getUserByEmail(email);
    return user.uid;
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "";
    if (code === "auth/user-not-found") return null;
    throw error;
  }
}

async function grantYear(params: {
  email: string;
  orderReference: string;
  now: number;
}): Promise<{
  previousWebExpiresAt: number | null;
  previousWebOrderReference: string | null;
  grantedExpiresAt: number;
  uid: string | null;
}> {
  const uid = await findUid(params.email);
  const ref = uid
    ? getDatabase().ref(`iapEntitlements/${uid}`)
    : getDatabase().ref(`pendingWebSubscriptions/${pendingKey(params.email)}`);
  let previousWebExpiresAt: number | null = null;
  let previousWebOrderReference: string | null = null;
  let grantedExpiresAt = params.now;
  const txn = await ref.transaction((current: EntitlementNode | null) => {
    const next = nextWebGrant(current, params);
    if (!("record" in next)) {
      previousWebExpiresAt =
        typeof current?.webPreviousExpiresAt === "number"
          ? current.webPreviousExpiresAt
          : null;
      previousWebOrderReference =
        typeof current?.webPreviousOrderReference === "string"
          ? current.webPreviousOrderReference
          : null;
      grantedExpiresAt =
        typeof current?.webExpiresAt === "number"
          ? current.webExpiresAt
          : params.now;
      return keepNode(current);
    }
    previousWebExpiresAt = next.previousWebExpiresAt;
    previousWebOrderReference = next.previousWebOrderReference;
    grantedExpiresAt = next.grantedExpiresAt;
    if (uid) return next.record;
    return { ...next.record, email: params.email };
  });
  if (!txn.committed) {
    throw new Error("grant_failed");
  }
  return {
    previousWebExpiresAt,
    previousWebOrderReference,
    grantedExpiresAt,
    uid,
  };
}

async function refundYear(params: {
  email: string;
  orderReference: string;
  uid: string | null;
  now: number;
}): Promise<void> {
  const uid = params.uid ?? (await findUid(params.email));
  const refs = [
    getDatabase().ref(`pendingWebSubscriptions/${pendingKey(params.email)}`),
  ];
  if (uid) refs.unshift(getDatabase().ref(`iapEntitlements/${uid}`));
  for (const ref of refs) {
    await ref.transaction((current: EntitlementNode | null) => {
      const next = refundWebGrant(current, params);
      if (!("record" in next)) return keepNode(current);
      return next.record;
    });
  }
}

export async function claimPendingWebSubscription(uid: string): Promise<void> {
  const user = await getAuth().getUser(uid);
  const email = normalizeEmail(user.email);
  if (!email) return;
  const pendingRef = getDatabase().ref(
    `pendingWebSubscriptions/${pendingKey(email)}`,
  );
  const pendingSnap = await pendingRef.once("value");
  const pending = pendingSnap.val() as EntitlementNode | null;
  if (!pending) return;
  const now = Date.now();
  const txn = await getDatabase()
    .ref(`iapEntitlements/${uid}`)
    .transaction((current: EntitlementNode | null) => {
      const next = claimPendingWeb(current, pending, now);
      if (!("record" in next)) return keepNode(current);
      const record = { ...next.record };
      delete record.email;
      return record;
    });
  if (!txn.committed) return;
  await pendingRef.transaction((current: EntitlementNode | null) => {
    if (!current || current.webOrderReference !== pending.webOrderReference) {
      return keepNode(current);
    }
    return null;
  });
}

export const wayforpayOrderStatus = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    setCheckoutCors(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "GET") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }
    const orderReference = req.query.orderReference;
    if (!isSafeOrderReference(orderReference)) {
      res.status(400).json({ error: "invalid_order" });
      return;
    }
    try {
      const snap = await getDatabase()
        .ref(`wayforpayOrders/${orderReference}`)
        .once("value");
      const view = publicOrderView(snap.val());
      if (!view) {
        res.status(404).json({ error: "unknown_order" });
        return;
      }
      res.status(200).json(view);
    } catch (error) {
      functions.logger.error("wayforpayOrderStatus failed", error);
      res.status(500).json({ error: "internal" });
    }
  });

export const createWayforpayCheckout = functions
  .runWith({ secrets: SECRETS })
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    setCheckoutCors(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }
    const merchant = merchantConfig();
    if (!merchant) {
      res.status(500).json({ error: "not_configured" });
      return;
    }
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }
    const now = Date.now();
    const orderReference = createOrderReference(now);
    const orderDate = Math.floor(now / 1000);
    try {
      await getDatabase().ref(`wayforpayOrders/${orderReference}`).set({
        email,
        amount: YEAR_PASS_AMOUNT,
        currency: YEAR_PASS_CURRENCY,
        status: "pending",
        createdAt: now,
        orderDate,
        uid: null,
      });
      res.status(200).json(
        buildPurchase({
          merchantAccount: merchant.account,
          secret: merchant.secret,
          email,
          orderReference,
          orderDate,
        }),
      );
    } catch (error) {
      functions.logger.error("createWayforpayCheckout failed", error);
      res.status(500).json({ error: "internal" });
    }
  });

export const wayforpayService = functions
  .runWith({ secrets: SECRETS })
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }
    const merchant = merchantConfig();
    if (!merchant) {
      res.status(500).json({ error: "not_configured" });
      return;
    }
    const rawValue = (req as { rawBody?: unknown }).rawBody;
    const rawBody = Buffer.isBuffer(rawValue) ? rawValue.toString("utf8") : "";
    const payload = readServicePayload(req.body) ?? readServicePayload(rawBody);
    if (!payload || !isSafeOrderReference(payload.orderReference)) {
      res.status(403).json({ error: "invalid_signature" });
      return;
    }
    const signatureOk = verifyServiceSignature(
      payload,
      merchant.secret,
      rawBody,
    );
    try {
      const orderRef = getDatabase().ref(
        `wayforpayOrders/${payload.orderReference}`,
      );
      const orderSnap = await orderRef.once("value");
      const order = (orderSnap.val() ?? null) as OrderNode | null;
      const decision = decideServiceAction({
        order:
          order?.status === "pending" ||
          order?.status === "approved" ||
          order?.status === "declined" ||
          order?.status === "refunded"
            ? { status: order.status }
            : null,
        payload,
        signatureOk,
      });
      if (decision.type === "reject") {
        res.status(decision.status).json({ error: "rejected" });
        return;
      }
      const now = Date.now();
      const email = normalizeEmail(order?.email);
      if (!email) {
        res.status(404).json({ error: "rejected" });
        return;
      }
      if (decision.type === "grant") {
        const saved = await grantYear({
          email,
          orderReference: payload.orderReference,
          now,
        });
        await orderRef.update({
          status: "approved",
          approvedAt: now,
          transactionStatus: payload.transactionStatus ?? "Approved",
          previousWebExpiresAt: saved.previousWebExpiresAt,
          previousWebOrderReference: saved.previousWebOrderReference,
          grantedExpiresAt: saved.grantedExpiresAt,
          uid: saved.uid,
        });
      } else if (decision.type === "refund") {
        await refundYear({
          email,
          orderReference: payload.orderReference,
          uid: order?.uid ?? null,
          now,
        });
        await orderRef.update({
          status: "refunded",
          refundedAt: now,
          transactionStatus: payload.transactionStatus ?? "Refunded",
        });
      } else if (decision.type === "record") {
        await orderRef.update({
          status: decision.status,
          transactionStatus: payload.transactionStatus ?? null,
        });
      }
      res.status(200).json(acceptBody(payload.orderReference, merchant.secret));
    } catch (error) {
      functions.logger.error("wayforpayService failed", error);
      res.status(500).json({ error: "internal" });
    }
  });
