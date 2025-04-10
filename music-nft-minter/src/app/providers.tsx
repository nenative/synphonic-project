'use client';

import { MintbaseProvider } from '@mintbase-js/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MintbaseProvider
      network="testnet"
      apiKey={process.env.NEXT_PUBLIC_MINTBASE_API_KEY || ''}
    >
      {children}
    </MintbaseProvider>
  );
} 