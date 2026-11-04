import { ImageManipulator } from "expo-image-manipulator";
import {
  IMAGE_COMPRESS_QUALITY,
  MAX_IMAGE_DIMENSION,
  resizeImageForUpload,
} from "../../utils/resize-image";

jest.mock("expo-image-manipulator", () => ({
  ImageManipulator: { manipulate: jest.fn() },
  SaveFormat: { JPEG: "jpeg" },
}));

const manipulate = ImageManipulator.manipulate as jest.Mock;

const setupManipulator = (result = { uri: "file:///out.jpg", width: 1600, height: 1200 }) => {
  const saveAsync = jest.fn().mockResolvedValue(result);
  const renderAsync = jest.fn().mockResolvedValue({ saveAsync });
  const resize = jest.fn();
  const context = { resize, renderAsync };
  resize.mockReturnValue(context);
  manipulate.mockReturnValue(context);
  return { resize, renderAsync, saveAsync };
};

describe("resizeImageForUpload", () => {
  beforeEach(() => {
    manipulate.mockReset();
  });

  it("resizes landscape images by width", async () => {
    const { resize, saveAsync } = setupManipulator();
    const result = await resizeImageForUpload({
      uri: "file:///in.jpg",
      width: 4000,
      height: 3000,
    });

    expect(resize).toHaveBeenCalledWith({ width: MAX_IMAGE_DIMENSION });
    expect(saveAsync).toHaveBeenCalledWith({
      compress: IMAGE_COMPRESS_QUALITY,
      format: "jpeg",
    });
    expect(result).toEqual({
      uri: "file:///out.jpg",
      width: 1600,
      height: 1200,
    });
  });

  it("resizes portrait images by height", async () => {
    const { resize } = setupManipulator();
    await resizeImageForUpload({
      uri: "file:///in.jpg",
      width: 3000,
      height: 4000,
    });

    expect(resize).toHaveBeenCalledWith({ height: MAX_IMAGE_DIMENSION });
  });

  it("does not upscale images already within the limit", async () => {
    const { resize } = setupManipulator({
      uri: "file:///out.jpg",
      width: 1000,
      height: 800,
    });
    await resizeImageForUpload({
      uri: "file:///in.jpg",
      width: 1000,
      height: 800,
    });

    expect(resize).not.toHaveBeenCalled();
  });

  it("falls back to the original image when manipulation fails", async () => {
    manipulate.mockImplementation(() => {
      throw new Error("boom");
    });

    const result = await resizeImageForUpload({
      uri: "file:///in.jpg",
      width: 4000,
      height: 3000,
    });

    expect(result).toEqual({
      uri: "file:///in.jpg",
      width: 4000,
      height: 3000,
    });
  });
});
