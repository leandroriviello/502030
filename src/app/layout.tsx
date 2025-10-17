import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '502030 - Finanzas Personales',
  description: 'Aplicación para gestionar finanzas personales con la regla 50/20/30',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}