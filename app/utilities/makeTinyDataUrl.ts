import 'server-only';

import sharp from "sharp";

export const makeTinyDataUrl = async (filePath: string) => {
  // read and downscale
  const tiny = await sharp(filePath)
    .resize(16) // width 16px, auto height
    .toBuffer();

  // base64 encode
  const base64 = tiny.toString("base64");

  // Build a data URL
  return `data:image/webp;base64,${base64}`;
};
