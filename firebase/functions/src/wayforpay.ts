import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { PROMO_SOURCE } from "./android-promo";

export const WEB_SOURCE = "wayforpay";
export const YEAR_PASS_MS = 365 * 24 * 60 * 60 * 1000;
export const YEAR_PASS_AMOUNT = "599.99";
export const YEAR_PASS_CURRENCY = "UAH";
export const YEAR_PASS_MINOR = 59999;
export const PRODUCT_NAME = "Jingle Plan+ річна підписка";
export const MERCHANT_DOMAIN = "jingle-plan.app";
export const PAY_URL = "https://secure.wayforpay.com/pay";
export const SERVICE_URL =
  "https://us-central1-advent-calendar-12.cloudfunctions.net/wayforpayService";
export const RETURN_URL = "https://jingle-plan.app/subscribe/result/";

export type WayforpayOrderStatus =
  | "pending"
  | "approved"
  | "declined"
  | "refunded";

export type WayforpayServicePayload = {
  merchantAccount?: string;
  orderReference?: string;
  merchantSignature?: string;
  amount?: number | string;
  currency?: string;
  authCode?: string;
  cardPan?: string;
  transactionStatus?: string;
  reasonCode?: number | string;
};

export type EntitlementNode = {
  source?: string;
  expiresAt?: number;
  codeHash?: string;
  redeemedAt?: number;
  updatedAt?: number;
  email?: string;
  webSource?: string;
  webExpiresAt?: number;
  webOrderReference?: string | null;
  webPurchasedAt?: number;
  webPreviousExpiresAt?: number | null;
  webPreviousOrderReference?: string | null;
  webUpdatedAt?: number;
};

export type ServiceAction =
  | { type: "reject"; status: 400 | 403 | 404 }
  | { type: "accept" }
  | { type: "grant" }
  | { type: "refund" }
  | { type: "record"; status: WayforpayOrderStatus };

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  return email;
}

export function pendingKey(email: string): string {
  return createHash("sha256").update(normalizeEmail(email) ?? email).digest("hex");
}

export function createOrderReference(now = Date.now()): string {
  return `jp_${now.toString(36)}_${randomBytes(6).toString("hex")}`;
}

export function isSafeOrderReference(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}

export function hmacMd5(value: string, secret: string): string {
  return createHmac("md5", secret) // codeql[js/weak-cryptographic-algorithm]
    .update(value, "utf8")
    .digest("hex");
}

export function signaturesMatch(expected: string, actual: unknown): boolean {
  if (typeof actual !== "string" || expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export function amountText(amount: unknown): string {
  if (typeof amount === "number" && Number.isFinite(amount)) return String(amount);
  if (typeof amount === "string") return amount.trim();
  return "";
}

export function amountMatches(amount: unknown): boolean {
  const text = amountText(amount).replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(text)) return false;
  const [whole, fraction = ""] = text.split(".");
  const minor =
    Number(whole) * 100 + Number(fraction.padEnd(2, "0").slice(0, 2));
  return minor === YEAR_PASS_MINOR;
}

export function buildPurchase(params: {
  merchantAccount: string;
  secret: string;
  email: string;
  orderReference: string;
  orderDate: number;
}): { action: string; fields: Record<string, string> } {
  const orderDate = String(params.orderDate);
  const signature = hmacMd5(
    [
      params.merchantAccount,
      MERCHANT_DOMAIN,
      params.orderReference,
      orderDate,
      YEAR_PASS_AMOUNT,
      YEAR_PASS_CURRENCY,
      PRODUCT_NAME,
      "1",
      YEAR_PASS_AMOUNT,
    ].join(";"),
    params.secret,
  );
  return {
    action: PAY_URL,
    fields: {
      merchantAccount: params.merchantAccount,
      merchantAuthType: "SimpleSignature",
      merchantDomainName: MERCHANT_DOMAIN,
      merchantSignature: signature,
      merchantTransactionSecureType: "AUTO",
      orderReference: params.orderReference,
      orderDate,
      amount: YEAR_PASS_AMOUNT,
      currency: YEAR_PASS_CURRENCY,
      "productName[]": PRODUCT_NAME,
      "productCount[]": "1",
      "productPrice[]": YEAR_PASS_AMOUNT,
      clientEmail: params.email,
      language: "UA",
      returnUrl: RETURN_URL,
      serviceUrl: SERVICE_URL,
    },
  };
}

function payloadRecord(value: unknown): WayforpayServicePayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as WayforpayServicePayload & Record<string, unknown>;
  if (typeof record.orderReference === "string") return record;
  const keys = Object.keys(record);
  if (keys.length === 1) {
    const fromKey = readServicePayload(keys[0]);
    if (fromKey) return fromKey;
    const only = record[keys[0]];
    if (typeof only === "string") return readServicePayload(only);
  }
  return record;
}

export function readServicePayload(body: unknown): WayforpayServicePayload | null {
  let value = body;
  if (Buffer.isBuffer(value)) value = value.toString("utf8");
  if (typeof value === "string") {
    try {
      value = JSON.parse(value.trim());
    } catch {
      return null;
    }
  }
  return payloadRecord(value);
}

function amountCandidates(amount: unknown, raw = ""): string[] {
  const values: string[] = [];
  const add = (value: string) => {
    if (value && !values.includes(value)) values.push(value);
  };
  add(amountText(amount));
  const token = raw.match(/"amount"\s*:\s*"?(\d+(?:\.\d+)?)"?/);
  if (token) add(token[1]);
  const basis = (token?.[1] ?? amountText(amount)).replace(",", ".");
  if (/^\d+(\.\d+)?$/.test(basis)) {
    const [whole, fraction = ""] = basis.split(".");
    add(String(Number(`${whole}.${fraction.padEnd(2, "0").slice(0, 2)}`)));
    add(`${whole}.${fraction.padEnd(2, "0").slice(0, 2)}`);
  }
  return values;
}

export function serviceSignatureString(payload: WayforpayServicePayload): string {
  return [
    payload.merchantAccount ?? "",
    payload.orderReference ?? "",
    amountText(payload.amount),
    payload.currency ?? "",
    payload.authCode ?? "",
    payload.cardPan ?? "",
    payload.transactionStatus ?? "",
    payload.reasonCode == null ? "" : String(payload.reasonCode),
  ].join(";");
}

export function verifyServiceSignature(
  payload: WayforpayServicePayload,
  secret: string,
  raw = "",
): boolean {
  return amountCandidates(payload.amount, raw).some((amount) =>
    signaturesMatch(
      hmacMd5(serviceSignatureString({ ...payload, amount }), secret),
      payload.merchantSignature,
    ),
  );
}

export function acceptBody(
  orderReference: string,
  secret: string,
  time = Math.floor(Date.now() / 1000),
) {
  const status = "accept";
  return {
    orderReference,
    status,
    time,
    signature: hmacMd5(
      [orderReference, status, String(time)].join(";"),
      secret,
    ),
  };
}

export function decideServiceAction(params: {
  order: { status: WayforpayOrderStatus } | null;
  payload: WayforpayServicePayload;
  signatureOk: boolean;
}): ServiceAction {
  if (
    !params.signatureOk ||
    !isSafeOrderReference(params.payload.orderReference)
  ) {
    return { type: "reject", status: 403 };
  }
  if (!params.order) return { type: "reject", status: 404 };
  if (
    params.payload.currency !== YEAR_PASS_CURRENCY ||
    !amountMatches(params.payload.amount)
  ) {
    return { type: "reject", status: 400 };
  }
  const transactionStatus = params.payload.transactionStatus;
  if (transactionStatus === "Approved") {
    if (
      params.order.status === "approved" ||
      params.order.status === "refunded"
    ) {
      return { type: "accept" };
    }
    return { type: "grant" };
  }
  if (transactionStatus === "Refunded" || transactionStatus === "Voided") {
    if (params.order.status === "refunded") return { type: "accept" };
    return { type: "refund" };
  }
  if (transactionStatus === "Declined" || transactionStatus === "Expired") {
    if (
      params.order.status === "approved" ||
      params.order.status === "refunded"
    ) {
      return { type: "accept" };
    }
    return { type: "record", status: "declined" };
  }
  return { type: "accept" };
}

export function nextWebGrant(
  current: EntitlementNode | null | undefined,
  params: { orderReference: string; now: number },
):
  | { unchanged: true }
  | {
      record: EntitlementNode;
      previousWebExpiresAt: number | null;
      previousWebOrderReference: string | null;
      grantedExpiresAt: number;
    } {
  if (current?.webOrderReference === params.orderReference) {
    return { unchanged: true };
  }
  const previousWebExpiresAt =
    typeof current?.webExpiresAt === "number" ? current.webExpiresAt : null;
  const previousWebOrderReference =
    typeof current?.webOrderReference === "string"
      ? current.webOrderReference
      : null;
  const base =
    previousWebExpiresAt != null && previousWebExpiresAt > params.now
      ? previousWebExpiresAt
      : params.now;
  const grantedExpiresAt = base + YEAR_PASS_MS;
  return {
    record: {
      ...(current ?? {}),
      webSource: WEB_SOURCE,
      webExpiresAt: grantedExpiresAt,
      webOrderReference: params.orderReference,
      webPurchasedAt: params.now,
      webPreviousExpiresAt: previousWebExpiresAt,
      webPreviousOrderReference: previousWebOrderReference,
      webUpdatedAt: params.now,
    },
    previousWebExpiresAt,
    previousWebOrderReference,
    grantedExpiresAt,
  };
}

export function refundWebGrant(
  current: EntitlementNode | null | undefined,
  params: { orderReference: string; now: number },
): { unchanged: true } | { record: EntitlementNode } {
  if (!current || current.webOrderReference !== params.orderReference) {
    return { unchanged: true };
  }
  const previous = current.webPreviousExpiresAt;
  const previousRef = current.webPreviousOrderReference;
  if (typeof previous === "number" && previous > params.now) {
    return {
      record: {
        ...current,
        webSource: WEB_SOURCE,
        webExpiresAt: previous,
        webOrderReference: typeof previousRef === "string" ? previousRef : null,
        webPreviousExpiresAt: null,
        webPreviousOrderReference: null,
        webUpdatedAt: params.now,
      },
    };
  }
  const record: EntitlementNode = { ...current, webUpdatedAt: params.now };
  delete record.webSource;
  delete record.webExpiresAt;
  delete record.webOrderReference;
  delete record.webPurchasedAt;
  delete record.webPreviousExpiresAt;
  delete record.webPreviousOrderReference;
  return { record };
}

export function claimPendingWeb(
  current: EntitlementNode | null | undefined,
  pending: EntitlementNode | null | undefined,
  now: number,
): { unchanged: true } | { record: EntitlementNode } {
  if (
    !pending ||
    pending.webSource !== WEB_SOURCE ||
    typeof pending.webExpiresAt !== "number"
  ) {
    return { unchanged: true };
  }
  if (current?.webOrderReference === pending.webOrderReference) {
    return { unchanged: true };
  }
  const currentExpires =
    typeof current?.webExpiresAt === "number" ? current.webExpiresAt : 0;
  if (currentExpires >= pending.webExpiresAt) {
    return { unchanged: true };
  }
  return {
    record: {
      ...(current ?? {}),
      webSource: WEB_SOURCE,
      webExpiresAt: pending.webExpiresAt,
      webOrderReference: pending.webOrderReference,
      webPurchasedAt: pending.webPurchasedAt,
      webPreviousExpiresAt: pending.webPreviousExpiresAt ?? null,
      webPreviousOrderReference: pending.webPreviousOrderReference ?? null,
      webUpdatedAt: now,
    },
  };
}

export function serverEntitlementExpiresAt(
  data: EntitlementNode | null | undefined,
  now = Date.now(),
): number | null {
  const promo =
    data?.source === PROMO_SOURCE &&
    typeof data.expiresAt === "number" &&
    data.expiresAt > now
      ? data.expiresAt
      : null;
  const web =
    data?.webSource === WEB_SOURCE &&
    typeof data.webExpiresAt === "number" &&
    data.webExpiresAt > now
      ? data.webExpiresAt
      : null;
  if (promo == null) return web;
  if (web == null) return promo;
  return Math.max(promo, web);
}
