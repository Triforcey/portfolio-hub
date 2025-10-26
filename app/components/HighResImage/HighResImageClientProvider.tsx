'use client';

import { createContext, useContext } from 'react';

const HighResImageContext = createContext<{
  tinyUrl: string;
} | null>(null);

export type HighResImageClientProviderProps = {
  tinyUrl: string;
  children: React.ReactNode;
};

export const HighResImageClientProvider = ({ tinyUrl, children }: HighResImageClientProviderProps) => {
  return (
    <HighResImageContext.Provider value={{ tinyUrl }}>
      {children}
    </HighResImageContext.Provider>
  );
};

export const useHighResImage = () => {
  const context = useContext(HighResImageContext);
  return context;
};
