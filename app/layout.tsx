import React from 'react';

import type { Metadata } from 'next';

import Footer from '@/components/Template/Footer';
import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import StructuredData from '@/components/Template/StructuredData';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import CommandPalette from '@/components/CommandPalette/CommandPalette';
import ClientWrapper from '@/components/ClientWrapper';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "Michael D'Angelo",
    template: "%s | Michael D'Angelo",
  },
  description:
    "Michael D'Angelo's personal website. Data scientist, machine learning engineer, and full-stack developer.",
  keywords: [
    "Michael D'Angelo",
    'data scientist',
    'machine learning',
    'full-stack developer',
    'engineer',
    'portfolio',
  ],
  authors: [{ name: "Michael D'Angelo" }],
  creator: "Michael D'Angelo",
  metadataBase: new URL('https://mldangelo.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mldangelo.com',
    siteName: "Michael D'Angelo",
    title: "Michael D'Angelo",
    description: 'Data scientist, machine learning engineer, and full-stack developer.',
    images: [
      {
        url: '/images/me.jpg',
        width: 1200,
        height: 630,
        alt: "Michael D'Angelo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [
      { url: '/images/favicon/apple-icon-180x180.png', sizes: '180x180' },
      { url: '/images/favicon/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/images/favicon/apple-icon-120x120.png', sizes: '120x120' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/images/favicon/apple-icon-180x180.png" />
      </head>
      <body className="relative min-h-screen flex flex-col">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 dark:block hidden">
            {/* Top left ambient shadow - only in dark mode */}
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-gray-100/[0.02] to-transparent blur-3xl"></div>
            {/* Bottom right ambient shadow - only in dark mode */}
            <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-gray-100/[0.02] to-transparent blur-3xl"></div>
            {/* Center ambient shadow for depth - only in dark mode */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gradient-to-b from-gray-100/[0.01] to-transparent blur-3xl"></div>
          </div>
          {/* Subtle grain texture overlay - reduced opacity in light mode */}
          <div
            className="absolute inset-0 opacity-[0.008] dark:opacity-[0.015] mix-blend-soft-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              filter: 'contrast(100%) brightness(100%)',
            }}
          ></div>
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-black px-4 py-2 z-50"
          >
            Skip to main content
          </a>
          <ClientWrapper>
            <Navigation />
            <div id="main-content" className="flex-1">{children}</div>
            <Footer />
            <CommandPalette />
          </ClientWrapper>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
