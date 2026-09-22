import { createHash, randomInt } from "crypto";

export const PROMO_DURATION_MS = 365 * 24 * 60 * 60 * 1000;
export const PROMO_SOURCE = "android_promo";
export const MAX_GENERATE_COUNT = 100;
export const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export type PromoErrorCode =
  | "unknown_code"
  | "already_used"
  | "already_redeemed"
  | "invalid_code";

export type PromoCodeRecord = {
  redeemedAt: number | null;
};

export type PromoEntitlementRecord = {
  source?: string;
  expiresAt?: number;
};

export type RedeemSuccess = {
  expiresAt: number;
  codeHash: string;
  redeemedAt: number;
  source: typeof PROMO_SOURCE;
};

export function formatPromoCode(raw: string): string {
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export function generatePromoCode(): string {
  let raw = "";
  for (let i = 0; i < 10; i += 1) {
    raw += CROCKFORD_ALPHABET[randomInt(CROCKFORD_ALPHABET.length)];
  }
  return formatPromoCode(raw);
}

export function normalizePromoCode(code: string): string | null {
  const normalized = code
    .trim()
    .toUpperCase()
    .replace(/[- ]/g, "")
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0");
  if (normalized.length !== 10) {
    return null;
  }
  for (const char of normalized) {
    if (!CROCKFORD_ALPHABET.includes(char)) {
      return null;
    }
  }
  return normalized;
}

export function hashPromoCode(normalized: string): string {
  return createHash("sha256").update(normalized).digest("hex");
}

export function isPromoActive(
  expiresAt: number | null | undefined,
  now = Date.now(),
): boolean {
  return typeof expiresAt === "number" && expiresAt > now;
}

export type PromoCodeNode = {
  createdAt?: number;
  redeemedAt?: number | null;
  redeemedByUid?: string | null;
};

export function nextPromoCodeOnConsume(
  current: PromoCodeNode | null,
  params: { uid: string; redeemedAt: number },
): PromoCodeNode | undefined {
  if (current == null) {
    return {
      createdAt: params.redeemedAt,
      redeemedAt: params.redeemedAt,
      redeemedByUid: params.uid,
    };
  }
  if (current.redeemedAt != null) {
    return undefined;
  }
  return {
    ...current,
    redeemedAt: params.redeemedAt,
    redeemedByUid: params.uid,
  };
}

export function consumeOutcome(params: {
  committed: boolean;
  redeemedByUid?: string | null;
  expectedUid: string;
}): "consumed" | "already_used" {
  if (params.committed && params.redeemedByUid === params.expectedUid) {
    return "consumed";
  }
  return "already_used";
}

export function applyRedeem(params: {
  codeRecord: PromoCodeRecord | null;
  entitlement: PromoEntitlementRecord | null;
  codeHash: string;
  now: number;
}): { error: PromoErrorCode } | RedeemSuccess {
  if (!params.codeRecord) {
    return { error: "unknown_code" };
  }
  if (params.codeRecord.redeemedAt != null) {
    return { error: "already_used" };
  }
  if (
    params.entitlement?.source === PROMO_SOURCE &&
    isPromoActive(params.entitlement.expiresAt, params.now)
  ) {
    return { error: "already_redeemed" };
  }

  return {
    expiresAt: params.now + PROMO_DURATION_MS,
    codeHash: params.codeHash,
    redeemedAt: params.now,
    source: PROMO_SOURCE,
  };
}

export function createPromoBatch(count: number): {
  plaintext: string;
  hash: string;
}[] {
  const seen = new Set<string>();
  const batch: { plaintext: string; hash: string }[] = [];
  while (batch.length < count) {
    const plaintext = generatePromoCode();
    const normalized = normalizePromoCode(plaintext);
    if (!normalized) {
      continue;
    }
    const hash = hashPromoCode(normalized);
    if (seen.has(hash)) {
      continue;
    }
    seen.add(hash);
    batch.push({ plaintext, hash });
  }
  return batch;
}

export const MAX_GENERATE_INSERT_ATTEMPTS = 20;

export async function insertUniquePromoCodes(
  count: number,
  insertIfAbsent: (hash: string) => Promise<boolean>,
): Promise<string[]> {
  const codes: string[] = [];
  let attempts = 0;
  const maxAttempts = Math.max(count * 5, MAX_GENERATE_INSERT_ATTEMPTS);
  while (codes.length < count) {
    attempts += 1;
    if (attempts > maxAttempts) {
      throw new Error("promo_generate_exhausted");
    }
    const batch = createPromoBatch(count - codes.length);
    for (const item of batch) {
      const inserted = await insertIfAbsent(item.hash);
      if (!inserted) {
        continue;
      }
      codes.push(item.plaintext);
      if (codes.length === count) {
        break;
      }
    }
  }
  return codes;
}

export type RedeemCommitDeps = {
  loadCode: (hash: string) => Promise<PromoCodeRecord | null>;
  loadEntitlement: (uid: string) => Promise<PromoEntitlementRecord | null>;
  consumeCode: (hash: string, uid: string, now: number) => Promise<boolean>;
  grantEntitlement: (uid: string, grant: RedeemSuccess) => Promise<boolean>;
  releaseCode: (hash: string, uid: string) => Promise<void>;
};

export async function redeemPromoCodeWithCommit(
  deps: RedeemCommitDeps,
  params: { uid: string; code: string; now: number },
): Promise<{ error: PromoErrorCode } | { expiresAt: number }> {
  const normalized = normalizePromoCode(params.code);
  if (!normalized) {
    return { error: "invalid_code" };
  }
  const codeHash = hashPromoCode(normalized);
  const result = applyRedeem({
    codeRecord: await deps.loadCode(codeHash),
    entitlement: await deps.loadEntitlement(params.uid),
    codeHash,
    now: params.now,
  });
  if ("error" in result) {
    return result;
  }
  const consumed = await deps.consumeCode(codeHash, params.uid, params.now);
  if (!consumed) {
    return { error: "already_used" };
  }
  try {
    const granted = await deps.grantEntitlement(params.uid, result);
    if (!granted) {
      await deps.releaseCode(codeHash, params.uid);
      return { error: "already_redeemed" };
    }
  } catch (error) {
    await deps.releaseCode(codeHash, params.uid);
    throw error;
  }
  return { expiresAt: result.expiresAt };
}
