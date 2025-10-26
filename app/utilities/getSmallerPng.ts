import 'server-only';

import sharp from 'sharp';

export const getSmallerPng = async (filePath: string, quality: number, width?: number, height?: number) => {
  const smaller = await sharp(filePath)
    .resize(width, height)
    .toFormat('png', { quality })
    .toBuffer();
  return smaller;
};
