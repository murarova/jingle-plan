import * as functions from "firebase-functions/v1";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import {
  consumeOutcome,
  insertUniquePromoCodes,
  isPromoActive,
  MAX_GENERATE_COUNT,
  nextPromoCodeOnConsume,
  PROMO_SOURCE,
  redeemPromoCodeWithCommit,
  type PromoErrorCode,
  type RedeemSuccess,
} from "./android-promo";

type Response = functions.Response;

function setCors(res: Response) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function sendJson(res: Response, status: number, body: unknown) {
  setCors(res);
  res.status(status).json(body);
}

function statusForError(code: PromoErrorCode): number {
  return 400;
}

async function requireUid(
  req: functions.Request,
): Promise<string | null> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  try {
    const decoded = await getAuth().verifyIdToken(header.slice(7));
    return decoded.uid;
  } catch {
    return null;
  }
}

async function isAdmin(uid: string): Promise<boolean> {
  const snapshot = await getDatabase()
    .ref(`usersProfiles/${uid}/role`)
    .once("value");
  return snapshot.val() === "admin";
}

export const generateAndroidPromoCodes = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    const uid = await requireUid(req);
    if (!uid) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }
    if (!(await isAdmin(uid))) {
      sendJson(res, 403, { error: "forbidden" });
      return;
    }

    const count = Number(req.body?.count);
    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > MAX_GENERATE_COUNT
    ) {
      sendJson(res, 400, { error: "invalid_count" });
      return;
    }

    try {
      const db = getDatabase();
      const now = Date.now();
      const codes = await insertUniquePromoCodes(count, async (hash) => {
        const txn = await db.ref(`promoCodes/${hash}`).transaction((current) => {
          if (current) {
            return;
          }
          return {
            createdAt: now,
            redeemedAt: null,
            redeemedByUid: null,
          };
        });
        return txn.committed;
      });
      sendJson(res, 200, { codes });
    } catch (error) {
      functions.logger.error("generateAndroidPromoCodes failed", error);
      sendJson(res, 500, { error: "internal" });
    }
  });

export const redeemAndroidPromoCode = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    const uid = await requireUid(req);
    if (!uid) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    const now = Date.now();
    const db = getDatabase();

    try {
      const result = await redeemPromoCodeWithCommit(
        {
          loadCode: async (hash) => {
            const snap = await db.ref(`promoCodes/${hash}`).once("value");
            if (!snap.exists()) {
              return null;
            }
            return { redeemedAt: snap.val()?.redeemedAt ?? null };
          },
          loadEntitlement: async (entitlementUid) => {
            const snap = await db
              .ref(`iapEntitlements/${entitlementUid}`)
              .once("value");
            const data = snap.val();
            if (!data) {
              return null;
            }
            return {
              source: data.source,
              expiresAt: data.expiresAt,
            };
          },
          consumeCode: async (hash, redeemedByUid, redeemedAt) => {
            const txn = await db.ref(`promoCodes/${hash}`).transaction(
              (current) =>
                nextPromoCodeOnConsume(current, {
                  uid: redeemedByUid,
                  redeemedAt,
                }),
              undefined,
              false,
            );
            return (
              consumeOutcome({
                committed: txn.committed,
                redeemedByUid: txn.snapshot?.val()?.redeemedByUid ?? null,
                expectedUid: redeemedByUid,
              }) === "consumed"
            );
          },
          grantEntitlement: async (
            entitlementUid: string,
            grant: RedeemSuccess,
          ) => {
            const txn = await db
              .ref(`iapEntitlements/${entitlementUid}`)
              .transaction(
                (current) => {
                  if (
                    current?.source === PROMO_SOURCE &&
                    isPromoActive(current.expiresAt, now)
                  ) {
                    return;
                  }
                  return {
                    ...(current ?? {}),
                    source: grant.source,
                    expiresAt: grant.expiresAt,
                    codeHash: grant.codeHash,
                    redeemedAt: grant.redeemedAt,
                    updatedAt: now,
                  };
                },
                undefined,
                false,
              );
            return txn.committed;
          },
          releaseCode: async (hash, redeemedByUid) => {
            await db.ref(`promoCodes/${hash}`).transaction(
              (current) => {
                if (!current) {
                  return;
                }
                if (
                  current.redeemedByUid !== redeemedByUid ||
                  current.redeemedAt == null
                ) {
                  return current;
                }
                return {
                  ...current,
                  redeemedAt: null,
                  redeemedByUid: null,
                };
              },
              undefined,
              false,
            );
          },
        },
        { uid, code: String(req.body?.code ?? ""), now },
      );
      if ("error" in result) {
        sendJson(res, statusForError(result.error), { error: result.error });
        return;
      }
      sendJson(res, 200, { expiresAt: result.expiresAt });
    } catch (error) {
      functions.logger.error("redeemAndroidPromoCode failed", error);
      sendJson(res, 500, { error: "internal" });
    }
  });

export const getAndroidPromoEntitlement = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    const uid = await requireUid(req);
    if (!uid) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    try {
      const snap = await getDatabase()
        .ref(`iapEntitlements/${uid}`)
        .once("value");
      const data = snap.val();
      if (
        data?.source === PROMO_SOURCE &&
        isPromoActive(data.expiresAt)
      ) {
        sendJson(res, 200, { expiresAt: data.expiresAt });
        return;
      }
      sendJson(res, 200, { expiresAt: null });
    } catch (error) {
      functions.logger.error("getAndroidPromoEntitlement failed", error);
      sendJson(res, 500, { error: "internal" });
    }
  });
