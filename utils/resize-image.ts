import {
  ImageManipulator,
  SaveFormat,
} from "expo-image-manipulator";

export const MAX_IMAGE_DIMENSION = 1600;
export const IMAGE_COMPRESS_QUALITY = 0.8;

export interface ResizedImage {
  uri: string;
  width: number;
  height: number;
}

interface ImageSource {
  uri: string;
  width: number;
  height: number;
}

export const resizeImageForUpload = async (
  source: ImageSource,
): Promise<ResizedImage> => {
  const longestSide = Math.max(source.width, source.height);
  const needsResize = longestSide > MAX_IMAGE_DIMENSION;

  try {
    const context = ImageManipulator.manipulate(source.uri);

    if (needsResize) {
      context.resize(
        source.width >= source.height
          ? { width: MAX_IMAGE_DIMENSION }
          : { height: MAX_IMAGE_DIMENSION },
      );
    }

    const rendered = await context.renderAsync();
    const result = await rendered.saveAsync({
      compress: IMAGE_COMPRESS_QUALITY,
      format: SaveFormat.JPEG,
    });

    return { uri: result.uri, width: result.width, height: result.height };
  } catch {
    return { uri: source.uri, width: source.width, height: source.height };
  }
};
