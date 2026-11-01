import * as functions from "firebase-functions/v1";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const FIRST_YEAR = 2024;

function yearsToClear(now = new Date()): string[] {
  const end = now.getFullYear();
  const years: string[] = [];
  for (let year = end; year >= FIRST_YEAR; year -= 1) {
    years.push(String(year));
  }
  return years;
}

async function deleteStoredImages(uid: string, year: string): Promise<void> {
  await getStorage()
    .bucket()
    .deleteFiles({
      prefix: `images/${year}/${uid}/`,
      force: true,
    });
}

export async function deleteAllUserData(uid: string): Promise<void> {
  const db = getDatabase();
  const years = yearsToClear();
  const tasks: Promise<unknown>[] = [
    db.ref(`usersProfiles/${uid}`).remove(),
    db.ref(`fcmTokens/${uid}`).remove(),
    db.ref(`iapEntitlements/${uid}`).remove(),
    getFirestore().collection("iapEntitlements").doc(uid).delete(),
    ...years.flatMap((year) => [
      db.ref(`${year}/users/${uid}`).remove(),
      deleteStoredImages(uid, year),
    ]),
  ];

  const results = await Promise.allSettled(tasks);
  const failed = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );
  if (failed) {
    throw failed.reason;
  }
}

export const deleteUserData = functions
  .region("us-central1")
  .auth.user()
  .onDelete(async (user) => {
    await deleteAllUserData(user.uid);
  });
