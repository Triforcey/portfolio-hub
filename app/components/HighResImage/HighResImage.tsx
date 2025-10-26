'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useHighResImage } from './HighResImageClientProvider';

export type HighResImageProps = {
  asset: string;
  lowQuality?: number;
  highQuality?: number;
  tinyImageProps?: Partial<React.ImgHTMLAttributes<HTMLImageElement>>;
  lowImageProps?: Partial<React.ImgHTMLAttributes<HTMLImageElement>>;
  highImageProps?: Partial<React.ImgHTMLAttributes<HTMLImageElement>>;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>;

const getImageUrl = (asset: string, quality: number) => {
  return `/small-png/${asset}?quality=${quality}`;
};

/**
 * Loads a high-resolution image in the background while showing a low-resolution image in the foreground.
 * @param asset - The asset name.
 * @param lowQuality - The quality of the low-resolution image.
 * @param highQuality - The quality of the high-resolution image.
 * @param tinyImageProps - Props to pass to the tiny-resolution Image (e.g., { width: 16, height: 16 }).
 * @param lowResNextImageProps - Props to pass to the low-resolution Image (e.g., { quality: 10 }).
 * @param highResNextImageProps - Props to pass to the high-resolution Image (e.g., { quality: 100 }).
 * @example
 * <HighResImage
 *   src="/image.jpg"
 *   lowResNextImageProps={{ quality: 10 }}
 *   highResNextImageProps={{ quality: 100 }}
 *   alt="Example"
 * />
 */
export const HighResImage = ({
  asset,
  lowQuality = 75,
  highQuality = 100,
  lowImageProps,
  highImageProps,
  tinyImageProps,
  width,
  height,
  ...commonProps
}: HighResImageProps) => {
  const context = useHighResImage();
  const tinyUrl = context?.tinyUrl;
  const [highestLoadedQuality, setHighestLoadedQuality] = useState(0);
  const lowResImgRef = useRef<HTMLImageElement>(null);
  const highResImgRef = useRef<HTMLImageElement>(null);

  // Check if the images are already loaded and set the highest loaded quality accordingly
  useEffect(() => {
    if (highResImgRef.current && highResImgRef.current.complete) {
      setHighestLoadedQuality(2);
      return;
    }
    if (lowResImgRef.current && lowResImgRef.current.complete) {
      setHighestLoadedQuality(currentQuality => currentQuality < 1 ? 1 : currentQuality);
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {tinyUrl && <img src={tinyUrl} {...lowImageProps} {...commonProps} />}
      <img ref={lowResImgRef} src={getImageUrl(asset, lowQuality)} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: highestLoadedQuality >= 1 ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }} {...tinyImageProps} {...commonProps} onLoad={() => setHighestLoadedQuality(currentQuality => currentQuality < 1 ? 1 : currentQuality)} />
      <img ref={highResImgRef} src={getImageUrl(asset, highQuality)} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: highestLoadedQuality >= 2 ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }} {...highImageProps} {...commonProps} onLoad={() => setHighestLoadedQuality(2)} />
    </div>
  );
};
