// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import AppChrome from './_modules/chrome/AppChrome';


export const metadata: Metadata = {
  title: 'Chan Store',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* AppChrome es un Client Component que internamente monta el CartProvider */}
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
