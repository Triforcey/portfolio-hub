import 'server-only';

import { makeTinyDataUrl } from "@/app/utilities/makeTinyDataUrl";
import { HighResImageClientProvider } from './HighResImageClientProvider';

export type HighResImageServerProviderProps = {
  imagePath: string;
  children: React.ReactNode;
};

export const HighResImageServerProvider = async ({ imagePath, children }: HighResImageServerProviderProps) => {
  // get super low-res data url
  const tinyUrl = await makeTinyDataUrl(imagePath);

  return (
    <HighResImageClientProvider tinyUrl={tinyUrl}>
      {children}
    </HighResImageClientProvider>
  );
};
