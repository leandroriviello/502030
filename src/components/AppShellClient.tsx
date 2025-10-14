'use client';

import type { PropsWithChildren } from 'react';
import { PWAInitializer } from '@/components/PWAInitializer';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { FinanceStoreProvider } from '@/store/useFinanceStore';
import { AuthProvider } from '@/components/AuthProvider';

export function AppShellClient({ children }: PropsWithChildren): JSX.Element {
  return (
    <AuthProvider>
      <FinanceStoreProvider>
        <PWAInitializer />
        <div className="min-h-screen bg-liquid-glass backdrop-blur-3xl">{children}</div>
        <FloatingActionButton />
      </FinanceStoreProvider>
    </AuthProvider>
  );
}
