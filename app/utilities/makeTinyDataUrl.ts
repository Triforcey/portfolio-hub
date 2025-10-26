import 'server-only';

import sharp from "sharp";

const tinyCache = new Map<string, string>();

export const makeTinyDataUrl = async (filePath: string) => {
  const cached = tinyCache.get(filePath);
  if (cached) return cached;

  // read and downscale
  const tiny = await sharp(filePath)
    .resize(16) // width 16px, auto height
    .toBuffer();

  // base64 encode
  const base64 = tiny.toString("base64");

  // Build a data URL
  const dataUrl = `data:image/png;base64,${base64}`;
  tinyCache.set(filePath, dataUrl);
  return dataUrl;
};
