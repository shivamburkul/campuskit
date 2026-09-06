import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Analytics } from '@/components/layout/Analytics';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import { ConsentBanner } from '@/components/layout/ConsentBanner';
import { themeBootstrapScript } from '@/lib/hooks/theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CampusKit — Free tools for students',
    template: '%s | CampusKit',
  },
  description: 'CampusKit is a free, fast utility platform for students: CGPA and attendance calculators, PDF and image tools, text and developer utilities — no account required.',
  applicationName: 'CampusKit',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'CampusKit',
    title: 'CampusKit — Free tools for students',
    description: 'Free CGPA, attendance, PDF, image, text and developer tools built for students.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusKit — Free tools for students',
    description: 'Free CGPA, attendance, PDF, image, text and developer tools built for students.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeBootstrapScript() }} />
        <meta name="google-site-verification" content="ZLp4e1BJBSVnbF_d9pQdWusMLEnSbNmeIDt1jtrq_NM" />
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConsentBanner />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}