import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { AppShellClient } from '@/components/AppShellClient';
import { SimpleAppShell } from '@/components/SimpleAppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

// Verificar variables de entorno en producción (solo en runtime, no en build)
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  require('@/lib/env-check');
}

/** Metadatos base de la app PWA */
export const metadata: Metadata = {
  title: '502030 · Finanzas personales',
  description:
    'Controla tus finanzas personales con la regla 50/20/30 en una interfaz Liquid Glass minimalista.',
  applicationName: '502030',
  manifest: '/manifest.webmanifest',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '502030'
  }
};

export default function RootLayout({
  children
}: PropsWithChildren): JSX.Element {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans bg-liquid-glass text-foreground antialiased">
        <ErrorBoundary>
          <AppShellClient>{children}</AppShellClient>
        </ErrorBoundary>
      </body>
    </html>
  );
}
