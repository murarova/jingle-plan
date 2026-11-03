import { TFunction } from "i18next";
import { resolveErrorMessage } from "./errors";

const AUTH_ERROR_KEYS: Record<string, string> = {
  "auth/invalid-credential": "errors.auth.invalidCredential",
  "auth/wrong-password": "errors.auth.invalidCredential",
  "auth/user-not-found": "errors.auth.invalidCredential",
  "auth/invalid-email": "errors.auth.invalidEmail",
  "auth/user-disabled": "errors.auth.userDisabled",
  "auth/too-many-requests": "errors.auth.tooManyRequests",
  "auth/network-request-failed": "errors.auth.network",
  "auth/email-already-in-use": "errors.auth.emailInUse",
  "auth/weak-password": "errors.auth.weakPassword",
  "auth/requires-recent-login": "errors.auth.requiresRecentLogin",
};

export const getAuthErrorCode = (error: unknown): string | null => {
  const message = resolveErrorMessage(error);
  return message?.startsWith("auth/") ? message : null;
};

export const resolveAuthErrorMessage = (
  error: unknown,
  t: TFunction,
): string => {
  const code = getAuthErrorCode(error);
  const key = code ? AUTH_ERROR_KEYS[code] : undefined;
  return key ? t(key) : t("errors.generic");
};
