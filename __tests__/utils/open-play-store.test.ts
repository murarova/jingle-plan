import { Linking } from "react-native";
import {
  ANDROID_APPLICATION_ID,
  openPlayStoreListing,
  PLAY_STORE_LISTING_URL,
} from "../../utils/open-play-store";

describe("openPlayStoreListing", () => {
  const openURL = jest.spyOn(Linking, "openURL");

  beforeEach(() => {
    openURL.mockReset();
  });

  afterAll(() => {
    openURL.mockRestore();
  });

  it("opens the Play Store app for this listing", async () => {
    openURL.mockResolvedValue(undefined as never);

    await openPlayStoreListing();

    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(
      `market://details?id=${ANDROID_APPLICATION_ID}`,
    );
    expect(PLAY_STORE_LISTING_URL).toBe(
      `https://play.google.com/store/apps/details?id=${ANDROID_APPLICATION_ID}`,
    );
  });

  it("opens the Play Store web listing when the store app cannot be opened", async () => {
    openURL
      .mockRejectedValueOnce(new Error("no activity"))
      .mockResolvedValueOnce(undefined as never);

    await openPlayStoreListing();

    expect(openURL).toHaveBeenNthCalledWith(
      1,
      `market://details?id=${ANDROID_APPLICATION_ID}`,
    );
    expect(openURL).toHaveBeenNthCalledWith(2, PLAY_STORE_LISTING_URL);
  });
});
