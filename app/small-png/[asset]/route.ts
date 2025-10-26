import { NextRequest, NextResponse } from 'next/server';
import { getSmallerPng } from '@/app/utilities/getSmallerPng';
import { z } from 'zod';

const supportedAssets: Record<string, {
  path: string;
  dimensions: {
    [P in (typeof supportedQualities)[number]]: {
      width: number;
      height: number;
    };
  };
}> = {
  'header-bg.png': {
    path: './app/header-bg.png',
    dimensions: {
      10: { width: 16, height: 16 },
      75: { width: 344, height: 288 },
      95: { width: 344, height: 288 },
      100: { width: 3440, height: 2880 }
    },
  },
};

const supportedQualities = [10, 75, 95, 100] as const;

const imageCache = new Map<string, Map<number, Uint8Array>>();

const getCachedImage = async (asset: string, quality: typeof supportedQualities[number]) => {
  if (!supportedAssets[asset]) {
    throw new Error('Asset not found');
  }

  if (!supportedQualities.includes(quality)) {
    throw new Error('Quality not supported');
  }

  let assetScope = imageCache.get(asset);
  const image = assetScope?.get(quality);
  if (image) return image;

  if (!assetScope) {
    assetScope = new Map<number, Uint8Array>();
    imageCache.set(asset, assetScope);
  }

  const dimensions = supportedAssets[asset].dimensions[quality];
  const smaller = await getSmallerPng(supportedAssets[asset].path, quality, dimensions.width, dimensions.height);
  const asUint8Array = new Uint8Array(smaller);
  assetScope.set(quality, asUint8Array);
  return asUint8Array;
};

export const GET = async (req: NextRequest, context: { params: Promise<{ asset: string }> }) => {
  try {
    const quality = z.coerce.number().int().min(1).max(100).parse(req.nextUrl.searchParams.get('quality')) as typeof supportedQualities[number];
    const { asset } = await context.params;
    const smaller = await getCachedImage(asset, quality);
    return new NextResponse(new Uint8Array(smaller), { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    switch ((error as Error).message) {
      case 'Asset not found':
        return new NextResponse('Asset not found', { status: 404 });
      case 'Quality not supported':
        return new NextResponse('Quality not supported', { status: 400 });
      case 'Image not found':
        return new NextResponse('Image not found', { status: 404 });
      default:
        throw error;
    }
  }
};
