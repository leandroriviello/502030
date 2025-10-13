import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import { PWAInitializer } from '@/components/PWAInitializer';
import { FinanceStoreProvider } from '@/store/useFinanceStore';
import './globals.css';

// Fuente principal - Inter como base, con fallback a fuentes del sistema Apple
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

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
      <body className={`${inter.variable} font-sans bg-liquid-glass text-foreground antialiased`}>
        <FinanceStoreProvider>
          <PWAInitializer />
          <div className="min-h-screen bg-liquid-glass backdrop-blur-3xl">{children}</div>
        </FinanceStoreProvider>
      </body>
    </html>
  );
}
