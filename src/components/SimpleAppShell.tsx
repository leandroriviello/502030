'use client';

import type { PropsWithChildren } from 'react';

export function SimpleAppShell({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className="min-h-screen bg-liquid-glass backdrop-blur-3xl">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">502030 - Finanzas Personales</h1>
        {children}
      </div>
    </div>
  );
}
