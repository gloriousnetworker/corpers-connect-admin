import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/providers/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Corpers Connect — Admin',
  description: 'Admin portal for managing the Corpers Connect platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CC Admin',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#008751',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-elevated text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
