import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PROMO_SOURCE } from "../src/android-promo";
import {
  WEB_SOURCE,
  YEAR_PASS_AMOUNT,
  YEAR_PASS_MS,
  acceptBody,
  amountMatches,
  buildPurchase,
  claimPendingWeb,
  decideServiceAction,
  hmacMd5,
  nextWebGrant,
  normalizeEmail,
  pendingKey,
  publicOrderView,
  readServicePayload,
  refundWebGrant,
  serverEntitlementExpiresAt,
  serviceSignatureString,
  verifyServiceSignature,
  type EntitlementNode,
  type WayforpayServicePayload,
} from "../src/wayforpay";

const SECRET = "merchant-secret";
const NOW = 1_700_000_000_000;

function signedPayload(
  overrides: Partial<WayforpayServicePayload> = {},
): WayforpayServicePayload {
  const payload: WayforpayServicePayload = {
    merchantAccount: "jingle_plan",
    orderReference: "jp_order_1",
    amount: YEAR_PASS_AMOUNT,
    currency: "UAH",
    authCode: "123456",
    cardPan: "44****4444",
    transactionStatus: "Approved",
    reasonCode: 1100,
    ...overrides,
  };
  payload.merchantSignature = hmacMd5(serviceSignatureString(payload), SECRET);
  return payload;
}

describe("WayForPay signatures", () => {
  it("accepts a signature built from the service fields", () => {
    const payload = signedPayload();
    assert.equal(verifyServiceSignature(payload, SECRET), true);
  });

  it("rejects a signature signed with another secret", () => {
    const payload = signedPayload();
    assert.equal(verifyServiceSignature(payload, "other-secret"), false);
  });

  it("reads the raw JSON WayForPay posts as the request body", () => {
    const raw =
      '{"merchantAccount":"jingle_plan","orderReference":"jp_order_1","amount":10.00,"currency":"UAH"}';
    const payload = readServicePayload({ [raw]: "" });
    assert.equal(payload?.orderReference, "jp_order_1");
    assert.equal(readServicePayload(raw)?.amount, 10);
  });

  it("accepts a signature over the amount text 10.00 when JSON parsed it as 10", () => {
    const raw =
      '{"merchantAccount":"jingle_plan","orderReference":"jp_order_1","amount":10.00,"currency":"UAH","authCode":"123456","cardPan":"44****4444","transactionStatus":"Approved","reasonCode":1100}';
    const payload = readServicePayload(raw);
    assert.ok(payload);
    payload.merchantSignature = hmacMd5(
      [
        "jingle_plan",
        "jp_order_1",
        "10.00",
        "UAH",
        "123456",
        "44****4444",
        "Approved",
        "1100",
      ].join(";"),
      SECRET,
    );
    assert.equal(payload.amount, 10);
    assert.equal(verifyServiceSignature(payload, SECRET, raw), true);
  });

  it("signs the purchase fields the browser posts to WayForPay", () => {
    const purchase = buildPurchase({
      merchantAccount: "jingle_plan",
      secret: SECRET,
      email: "buyer@example.com",
      orderReference: "jp_order_1",
      orderDate: 1_700_000_000,
    });
    assert.equal(purchase.action, "https://secure.wayforpay.com/pay");
    assert.equal(purchase.fields.amount, YEAR_PASS_AMOUNT);
    assert.equal(purchase.fields.currency, "UAH");
    assert.equal(purchase.fields.clientEmail, "buyer@example.com");
    assert.equal(purchase.fields["productPrice[]"], YEAR_PASS_AMOUNT);
    const expected = hmacMd5(
      [
        "jingle_plan",
        "jingle-plan.app",
        "jp_order_1",
        "1700000000",
        YEAR_PASS_AMOUNT,
        "UAH",
        "Jingle Plan+ річна підписка",
        "1",
        YEAR_PASS_AMOUNT,
      ].join(";"),
      SECRET,
    );
    assert.equal(purchase.fields.merchantSignature, expected);
  });

  it("signs the accept response WayForPay requires", () => {
    const body = acceptBody("jp_order_1", SECRET, 1_700_000_000);
    assert.equal(body.status, "accept");
    assert.equal(
      body.signature,
      hmacMd5("jp_order_1;accept;1700000000", SECRET),
    );
  });
});

describe("WayForPay service decisions", () => {
  it("rejects a bad signature before a grant", () => {
    const payload = signedPayload();
    payload.merchantSignature = "not-the-signature";
    assert.deepEqual(
      decideServiceAction({
        order: { status: "pending" },
        payload,
        signatureOk: false,
      }),
      { type: "reject", status: 403 },
    );
  });

  it("rejects an amount that is not 599.99 UAH", () => {
    const payload = signedPayload({ amount: "10.00" });
    assert.equal(amountMatches("599.99"), true);
    assert.equal(amountMatches("10.00"), false);
    assert.deepEqual(
      decideServiceAction({
        order: { status: "pending" },
        payload,
        signatureOk: true,
      }),
      { type: "reject", status: 400 },
    );
  });

  it("grants a new approved payment and ignores a replay", () => {
    const payload = signedPayload();
    assert.equal(
      decideServiceAction({
        order: { status: "pending" },
        payload,
        signatureOk: true,
      }).type,
      "grant",
    );
    assert.equal(
      decideServiceAction({
        order: { status: "approved" },
        payload,
        signatureOk: true,
      }).type,
      "accept",
    );
  });

  it("refunds an approved order once", () => {
    const payload = signedPayload({ transactionStatus: "Refunded" });
    assert.equal(
      decideServiceAction({
        order: { status: "approved" },
        payload,
        signatureOk: true,
      }).type,
      "refund",
    );
    assert.equal(
      decideServiceAction({
        order: { status: "refunded" },
        payload,
        signatureOk: true,
      }).type,
      "accept",
    );
  });
});

describe("web year entitlement", () => {
  const promo: EntitlementNode = {
    source: PROMO_SOURCE,
    expiresAt: NOW + 10_000,
    codeHash: "hash",
  };

  it("grants one year and keeps an Android promo on the same record", () => {
    const granted = nextWebGrant(promo, {
      orderReference: "jp_order_1",
      now: NOW,
    });
    assert.ok("record" in granted);
    assert.equal(granted.record.source, PROMO_SOURCE);
    assert.equal(granted.record.codeHash, "hash");
    assert.equal(granted.record.expiresAt, promo.expiresAt);
    assert.equal(granted.record.webSource, WEB_SOURCE);
    assert.equal(granted.record.webExpiresAt, NOW + YEAR_PASS_MS);
    assert.equal(granted.previousWebExpiresAt, null);
  });

  it("does not add a second year when the same order is applied again", () => {
    const granted = nextWebGrant(null, {
      orderReference: "jp_order_1",
      now: NOW,
    });
    assert.ok("record" in granted);
    assert.deepEqual(
      nextWebGrant(granted.record, { orderReference: "jp_order_1", now: NOW + 5 }),
      { unchanged: true },
    );
  });

  it("extends a later order from the current web expiry", () => {
    const first = nextWebGrant(null, { orderReference: "jp_order_1", now: NOW });
    assert.ok("record" in first);
    const second = nextWebGrant(first.record, {
      orderReference: "jp_order_2",
      now: NOW + 1_000,
    });
    assert.ok("record" in second);
    assert.equal(second.previousWebExpiresAt, NOW + YEAR_PASS_MS);
    assert.equal(second.record.webExpiresAt, NOW + YEAR_PASS_MS + YEAR_PASS_MS);
    assert.equal(second.record.webOrderReference, "jp_order_2");
  });

  it("restores the previous expiry when the latest order is refunded", () => {
    const first = nextWebGrant(null, { orderReference: "jp_order_1", now: NOW });
    assert.ok("record" in first);
    const second = nextWebGrant(first.record, {
      orderReference: "jp_order_2",
      now: NOW + 1_000,
    });
    assert.ok("record" in second);
    const refunded = refundWebGrant(second.record, {
      orderReference: "jp_order_2",
      now: NOW + 2_000,
    });
    assert.ok("record" in refunded);
    assert.equal(refunded.record.webExpiresAt, NOW + YEAR_PASS_MS);
    assert.equal(refunded.record.webOrderReference, "jp_order_1");
    assert.equal(refunded.record.source, undefined);
  });

  it("removes only the web year when a refund has no previous period", () => {
    const granted = nextWebGrant(promo, {
      orderReference: "jp_order_1",
      now: NOW,
    });
    assert.ok("record" in granted);
    const refunded = refundWebGrant(granted.record, {
      orderReference: "jp_order_1",
      now: NOW + 1,
    });
    assert.ok("record" in refunded);
    assert.equal(refunded.record.webExpiresAt, undefined);
    assert.equal(refunded.record.webSource, undefined);
    assert.equal(refunded.record.source, PROMO_SOURCE);
    assert.equal(refunded.record.expiresAt, promo.expiresAt);
  });

  it("claims a pending email onto the account without shortening a longer year", () => {
    const pending = nextWebGrant(null, {
      orderReference: "jp_order_1",
      now: NOW,
    });
    assert.ok("record" in pending);
    const claimed = claimPendingWeb(null, pending.record, NOW + 1);
    assert.ok("record" in claimed);
    assert.equal(claimed.record.webOrderReference, "jp_order_1");
    assert.equal(claimed.record.webExpiresAt, NOW + YEAR_PASS_MS);

    const longer = nextWebGrant(null, {
      orderReference: "jp_order_later",
      now: NOW + YEAR_PASS_MS,
    });
    assert.ok("record" in longer);
    assert.deepEqual(
      claimPendingWeb(longer.record, pending.record, NOW + YEAR_PASS_MS),
      { unchanged: true },
    );
  });

  it("returns the later active expiry and still honors an Android promo", () => {
    assert.equal(
      serverEntitlementExpiresAt(
        {
          source: PROMO_SOURCE,
          expiresAt: NOW + 5_000,
          webSource: WEB_SOURCE,
          webExpiresAt: NOW + YEAR_PASS_MS,
        },
        NOW,
      ),
      NOW + YEAR_PASS_MS,
    );
    assert.equal(
      serverEntitlementExpiresAt(
        { source: PROMO_SOURCE, expiresAt: NOW + 5_000 },
        NOW,
      ),
      NOW + 5_000,
    );
    assert.equal(
      serverEntitlementExpiresAt(
        { webSource: WEB_SOURCE, webExpiresAt: NOW - 1 },
        NOW,
      ),
      null,
    );
  });
});

describe("public order status", () => {
  it("returns the status a buyer can be shown", () => {
    assert.deepEqual(
      publicOrderView({ status: "approved", email: "buyer@example.com" }),
      { status: "approved", email: "buyer@example.com" },
    );
    assert.equal(publicOrderView({ status: "other", email: "a@b.c" }), null);
    assert.equal(publicOrderView(null), null);
  });
});

describe("payer email", () => {
  it("normalizes the address used to match an account", () => {
    assert.equal(normalizeEmail("  Buyer@Example.com "), "buyer@example.com");
    assert.equal(normalizeEmail("not-an-email"), null);
    assert.equal(pendingKey("Buyer@Example.com"), pendingKey("buyer@example.com"));
  });
});
