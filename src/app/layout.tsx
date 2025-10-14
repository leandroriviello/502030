import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/components/AuthProvider';
import './globals.css';

const AppShellClient = dynamic(
  () => import('@/components/AppShellClient').then(mod => mod.AppShellClient),
  { ssr: false }
);

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
        <AuthProvider>
          <AppShellClient>{children}</AppShellClient>
        </AuthProvider>
      </body>
    </html>
  );
}
