import { getDatabase } from "firebase-admin/database";
import { getMessaging } from "firebase-admin/messaging";
import type { DataSnapshot } from "firebase-admin/database";
import type { SendResponse } from "firebase-admin/messaging";

const KYIV_TIMEZONE = "Europe/Kyiv";

type NotificationMessage = { title: string; body: string };

type MonthlyConfig = {
  enabled?: boolean;
  default?: NotificationMessage;
  overrides?: Record<string, NotificationMessage>;
};

type DecemberDailyConfig = {
  enabled?: boolean;
  title?: string;
  body?: string;
};

type TokenEntry = { uid: string; token: string };

const db = () => getDatabase();

function applyTemplate(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value),
    text,
  );
}

function getKyivMonth(date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: KYIV_TIMEZONE,
      month: "numeric",
    }).format(date),
  );
}

function getKyivDay(date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: KYIV_TIMEZONE,
      day: "numeric",
    }).format(date),
  );
}

async function getEligibleTokens(): Promise<TokenEntry[]> {
  const tokensSnapshot = await db().ref("/fcmTokens").once("value");

  if (!tokensSnapshot.exists()) {
    return [];
  }

  const tokenEntries: TokenEntry[] = [];
  tokensSnapshot.forEach((child: DataSnapshot) => {
    const data = child.val();
    if (!data?.token) {
      return;
    }

    const isEligible = data.isSubscriber === true || data.isAdmin === true;
    if (!isEligible) {
      return;
    }

    tokenEntries.push({ uid: child.key!, token: data.token });
  });

  return tokenEntries;
}

async function sendNotification(
  tokenEntries: TokenEntry[],
  notification: NotificationMessage,
) {
  if (tokenEntries.length === 0) {
    console.log("No eligible tokens found");
    return;
  }

  const tokens = tokenEntries.map((entry) => entry.token);

  const response = await getMessaging().sendEachForMulticast({
    tokens,
    notification,
  });

  const invalidTokenUids: string[] = [];
  response.responses.forEach((res: SendResponse, idx: number) => {
    if (!res.success) {
      const code = res.error?.code;
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered"
      ) {
        invalidTokenUids.push(tokenEntries[idx].uid);
      }
    }
  });

  if (invalidTokenUids.length > 0) {
    await Promise.all(
      invalidTokenUids.map((uid) => db().ref(`/fcmTokens/${uid}`).remove()),
    );
    console.log(`Removed ${invalidTokenUids.length} invalid tokens`);
  }

  console.log(
    `Sent: ${response.successCount}, Failed: ${response.failureCount}`,
  );
}

async function resolveMonthlyMessage(): Promise<NotificationMessage | null> {
  const snapshot = await db().ref("/notifications/monthly").once("value");
  const config = snapshot.val() as MonthlyConfig | null;

  if (!config?.enabled) {
    console.log("Monthly notifications disabled or missing");
    return null;
  }

  if (!config.default?.title || !config.default?.body) {
    console.log("Monthly notification missing default message in RTDB");
    return null;
  }

  const month = String(getKyivMonth());
  const override = config.overrides?.[month];

  if (override?.title && override?.body) {
    return override;
  }

  return config.default;
}

async function resolveDecemberDailyMessage(): Promise<NotificationMessage | null> {
  const snapshot = await db().ref("/notifications/decemberDaily").once("value");
  const config = snapshot.val() as DecemberDailyConfig | null;

  if (!config?.enabled) {
    console.log("December daily notifications disabled or missing");
    return null;
  }

  if (!config.title || !config.body) {
    console.log("December daily notification missing message in RTDB");
    return null;
  }

  const day = String(getKyivDay());

  return {
    title: applyTemplate(config.title, { day }),
    body: applyTemplate(config.body, { day }),
  };
}

export async function runMonthlyNotifications(): Promise<void> {
  const message = await resolveMonthlyMessage();
  if (!message) {
    return;
  }

  const tokenEntries = await getEligibleTokens();
  await sendNotification(tokenEntries, message);
}

export async function runDecemberDailyNotifications(): Promise<void> {
  const message = await resolveDecemberDailyMessage();
  if (!message) {
    return;
  }

  const tokenEntries = await getEligibleTokens();
  await sendNotification(tokenEntries, message);
}
