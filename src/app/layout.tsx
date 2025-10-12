import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import './globals.css';

/** Metadatos base de la app para SEO y PWA */
export const metadata: Metadata = {
  title: 'Regla 50/20/30 · Control financiero',
  description:
    'Dashboard financiero minimalista inspirado en Liquid Glass para organizar gastos según la regla 50/20/30.',
  applicationName: 'Regla 50/20/30',
  manifest: '/manifest.webmanifest',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Regla 50/20/30'
  }
};

/** Layout raíz requerido por Next.js con soporte para modo oscuro */
export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-surface text-foreground antialiased">{children}</body>
    </html>
  );
}
