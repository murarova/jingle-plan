import { getAuth } from "@react-native-firebase/auth";
import { EXPO_PUBLIC_IAP_FUNCTIONS_BASE_URL } from "@env";

export type PromoRedeemErrorCode =
  | "unknown_code"
  | "already_used"
  | "already_redeemed"
  | "invalid_code"
  | "unauthorized"
  | "network";

export class PromoRedeemError extends Error {
  code: PromoRedeemErrorCode;

  constructor(code: PromoRedeemErrorCode) {
    super(code);
    this.code = code;
    this.name = "PromoRedeemError";
  }
}

export type AndroidPromoEntitlementLookup =
  | { available: true; expiresAt: number | null }
  | { available: false };

function functionsBaseUrl(): string | null {
  const base = EXPO_PUBLIC_IAP_FUNCTIONS_BASE_URL;
  if (typeof base !== "string" || base.length === 0) {
    return null;
  }
  return base.replace(/\/$/, "");
}

async function postFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const base = functionsBaseUrl();
  if (!base) {
    throw new PromoRedeemError("network");
  }
  const user = getAuth().currentUser;
  if (!user) {
    throw new PromoRedeemError("unauthorized");
  }
  const token = await user.getIdToken();
  let response: Response;
  try {
    response = await fetch(`${base}/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new PromoRedeemError("network");
  }

  let payload: { expiresAt?: number | null; error?: string } = {};
  try {
    payload = (await response.json()) as {
      expiresAt?: number | null;
      error?: string;
    };
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const error = payload.error;
    if (
      error === "unknown_code" ||
      error === "already_used" ||
      error === "already_redeemed" ||
      error === "invalid_code" ||
      error === "unauthorized"
    ) {
      throw new PromoRedeemError(error);
    }
    throw new PromoRedeemError("network");
  }

  return payload as T;
}

export async function getAndroidPromoEntitlement(): Promise<AndroidPromoEntitlementLookup> {
  if (!functionsBaseUrl()) {
    return { available: false };
  }
  if (!getAuth().currentUser) {
    return { available: true, expiresAt: null };
  }
  try {
    const payload = await postFunction<{ expiresAt: number | null }>(
      "getAndroidPromoEntitlement",
      {},
    );
    return {
      available: true,
      expiresAt: typeof payload.expiresAt === "number" ? payload.expiresAt : null,
    };
  } catch {
    return { available: false };
  }
}

export async function redeemAndroidPromoCode(code: string): Promise<number> {
  const payload = await postFunction<{ expiresAt: number }>(
    "redeemAndroidPromoCode",
    { code },
  );
  if (typeof payload.expiresAt !== "number") {
    throw new PromoRedeemError("network");
  }
  return payload.expiresAt;
}
