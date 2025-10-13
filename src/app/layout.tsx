import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Inter, SF_Pro_Display, SF_Pro_Text } from 'next/font/google';
import { PWAInitializer } from '@/components/PWAInitializer';
import './globals.css';

// Fuente principal - SF Pro Display (equivalente a Apple's system font)
const sfProDisplay = SF_Pro_Display({
  subsets: ['latin'],
  variable: '--font-sf-pro-display',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// Fuente secundaria - SF Pro Text para texto más pequeño
const sfProText = SF_Pro_Text({
  subsets: ['latin'],
  variable: '--font-sf-pro-text',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// Fallback con Inter
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
      <body className={`${sfProDisplay.variable} ${sfProText.variable} ${inter.variable} font-sans bg-liquid-glass text-foreground antialiased`}>
        <PWAInitializer />
        <div className="min-h-screen bg-liquid-glass backdrop-blur-3xl">{children}</div>
      </body>
    </html>
  );
}
