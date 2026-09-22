import {
  applyRedeem,
  createPromoBatch,
  generatePromoCode,
  hashPromoCode,
  insertUniquePromoCodes,
  nextPromoCodeOnConsume,
  consumeOutcome,
  normalizePromoCode,
  PROMO_DURATION_MS,
  PROMO_SOURCE,
  redeemPromoCodeWithCommit,
} from "../firebase/functions/src/android-promo";

describe("android promo codes", () => {
  it("normalizes hyphens, case, and crockford lookalikes", () => {
    expect(normalizePromoCode("ab1o-il2345")).toBe("AB10112345");
  });

  it("hashes the same normalized code consistently", () => {
    const first = hashPromoCode(normalizePromoCode("ABCD-EFGHJK")!);
    const second = hashPromoCode(normalizePromoCode("abcd-efghjk")!);
    expect(first).toBe(second);
    expect(first).toHaveLength(64);
  });

  it("generates a 10-character crockford code with a hyphen", () => {
    expect(generatePromoCode()).toMatch(
      /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{6}$/,
    );
  });

  it("creates unique codes in a batch", () => {
    const batch = createPromoBatch(20);
    const hashes = new Set(batch.map((item) => item.hash));
    expect(batch).toHaveLength(20);
    expect(hashes.size).toBe(20);
  });

  it("grants 365 days from redemption", () => {
    const now = Date.parse("2026-09-16T00:00:00.000Z");
    const result = applyRedeem({
      codeRecord: { redeemedAt: null },
      entitlement: null,
      codeHash: "abc",
      now,
    });
    expect("expiresAt" in result).toBe(true);
    if ("expiresAt" in result) {
      expect(result.expiresAt - now).toBe(PROMO_DURATION_MS);
      expect(result.source).toBe(PROMO_SOURCE);
    }
  });

  it("rejects an unknown code", () => {
    expect(
      applyRedeem({
        codeRecord: null,
        entitlement: null,
        codeHash: "abc",
        now: 1,
      }),
    ).toEqual({ error: "unknown_code" });
  });

  it("rejects a code that was already used", () => {
    expect(
      applyRedeem({
        codeRecord: { redeemedAt: 10 },
        entitlement: null,
        codeHash: "abc",
        now: 20,
      }),
    ).toEqual({ error: "already_used" });
  });

  it("rejects a second code while a promo year is still active", () => {
    const now = 1_000;
    expect(
      applyRedeem({
        codeRecord: { redeemedAt: null },
        entitlement: { source: PROMO_SOURCE, expiresAt: now + 1 },
        codeHash: "abc",
        now,
      }),
    ).toEqual({ error: "already_redeemed" });
  });

  it("allows a new code after the previous promo year expired", () => {
    const now = 1_000;
    const result = applyRedeem({
      codeRecord: { redeemedAt: null },
      entitlement: { source: PROMO_SOURCE, expiresAt: now - 1 },
      codeHash: "abc",
      now,
    });
    expect("expiresAt" in result).toBe(true);
  });

  it("does not abort consume when RTDB has not loaded the code yet", () => {
    expect(
      nextPromoCodeOnConsume(null, { uid: "user-1", redeemedAt: 50 }),
    ).toEqual({
      createdAt: 50,
      redeemedAt: 50,
      redeemedByUid: "user-1",
    });
  });

  it("marks an unused code record as consumed", () => {
    expect(
      nextPromoCodeOnConsume(
        { createdAt: 10, redeemedAt: null },
        { uid: "user-1", redeemedAt: 50 },
      ),
    ).toEqual({
      createdAt: 10,
      redeemedAt: 50,
      redeemedByUid: "user-1",
    });
  });

  it("aborts consume only when redeemedAt is already set", () => {
    expect(
      nextPromoCodeOnConsume(
        { createdAt: 10, redeemedAt: 20, redeemedByUid: "other" },
        { uid: "user-1", redeemedAt: 50 },
      ),
    ).toBeUndefined();
  });

  it("treats a committed consume as success only for the same user", () => {
    expect(
      consumeOutcome({
        committed: true,
        redeemedByUid: "user-1",
        expectedUid: "user-1",
      }),
    ).toBe("consumed");
    expect(
      consumeOutcome({
        committed: false,
        redeemedByUid: null,
        expectedUid: "user-1",
      }),
    ).toBe("already_used");
  });

  it("retries promo inserts when a hash already exists", async () => {
    let calls = 0;
    const codes = await insertUniquePromoCodes(1, async () => {
      calls += 1;
      return calls > 1;
    });
    expect(codes).toHaveLength(1);
    expect(calls).toBeGreaterThan(1);
  });

  it("rolls back a consumed code when entitlement grant is rejected", async () => {
    const releaseCode = jest.fn();
    const result = await redeemPromoCodeWithCommit(
      {
        loadCode: async () => ({ redeemedAt: null }),
        loadEntitlement: async () => null,
        consumeCode: async () => true,
        grantEntitlement: async () => false,
        releaseCode,
      },
      { uid: "user-1", code: "ABCD-EFGHJK", now: 1_000 },
    );
    expect(result).toEqual({ error: "already_redeemed" });
    expect(releaseCode).toHaveBeenCalledWith(expect.any(String), "user-1");
  });

  it("rolls back a consumed code when entitlement grant throws", async () => {
    const releaseCode = jest.fn();
    await expect(
      redeemPromoCodeWithCommit(
        {
          loadCode: async () => ({ redeemedAt: null }),
          loadEntitlement: async () => null,
          consumeCode: async () => true,
          grantEntitlement: async () => {
            throw new Error("write failed");
          },
          releaseCode,
        },
        { uid: "user-1", code: "ABCD-EFGHJK", now: 1_000 },
      ),
    ).rejects.toThrow("write failed");
    expect(releaseCode).toHaveBeenCalled();
  });
});
