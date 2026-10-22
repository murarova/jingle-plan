import { getAuth } from "@react-native-firebase/auth";
import {
  getAndroidPromoEntitlement,
  PromoRedeemError,
  redeemAndroidPromoCode,
} from "../../services/android-promo";

const mockGetIdToken = jest.fn();

beforeEach(() => {
  mockGetIdToken.mockReset().mockResolvedValue("id-token");
  (getAuth as jest.Mock).mockReturnValue({
    currentUser: { getIdToken: mockGetIdToken },
  });
  global.fetch = jest.fn();
});

describe("android promo client", () => {
  it("returns a future expiry from getAndroidPromoEntitlement", async () => {
    const expiresAt = Date.now() + 1000;
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ expiresAt }),
    });
    await expect(getAndroidPromoEntitlement()).resolves.toEqual({
      available: true,
      expiresAt,
    });
  });

  it("returns a successful empty lookup when there is no promo", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ expiresAt: null }),
    });
    await expect(getAndroidPromoEntitlement()).resolves.toEqual({
      available: true,
      expiresAt: null,
    });
  });

  it("treats network failures as an unavailable lookup", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("offline"));
    await expect(getAndroidPromoEntitlement()).resolves.toEqual({
      available: false,
    });
  });

  it("clears promo when there is no signed-in user", async () => {
    (getAuth as jest.Mock).mockReturnValue({ currentUser: null });
    await expect(getAndroidPromoEntitlement()).resolves.toEqual({
      available: true,
      expiresAt: null,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("redeems a code and returns expiresAt", async () => {
    const expiresAt = Date.now() + 1000;
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ expiresAt }),
    });
    await expect(redeemAndroidPromoCode("ABCD-EFGHJK")).resolves.toBe(
      expiresAt,
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/functions/redeemAndroidPromoCode",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer id-token",
        }),
      }),
    );
  });

  it("maps used-code errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "already_used" }),
    });
    await expect(redeemAndroidPromoCode("ABCD-EFGHJK")).rejects.toMatchObject({
      code: "already_used",
    });
    await expect(redeemAndroidPromoCode("ABCD-EFGHJK")).rejects.toBeInstanceOf(
      PromoRedeemError,
    );
  });
});
