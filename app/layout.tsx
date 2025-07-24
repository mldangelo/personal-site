import React from 'react';

import type { Metadata } from 'next';
import { Raleway, Source_Sans_3 } from 'next/font/google';

import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import '@/static/css/main.scss';

const sourceSans = Source_Sans_3({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

const raleway = Raleway({
  weight: ['400', '800', '900'],
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kai Zhang',
    template: '%s | Kai Zhang',
  },
  description: "Kai Zhang's personal website.",
  keywords: ['Kai Zhang', 'PhD Student', 'Game Theory', 'Control Theory'],
  authors: [{ name: 'Kai Zhang' }],
  creator: 'Kai Zhang',
  metadataBase: new URL('https://zhangkai.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zhangkai.io',
    siteName: 'Kai Zhang',
    title: 'Kai Zhang',
    description: 'PhD Student at ETH Zurich',
    images: [
      {
        url: '/images/me.jpg',
        width: 1200,
        height: 1200,
        alt: 'Kai Zhang',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${raleway.variable}`}>
      <body>
        <div id="wrapper">
          <Navigation />
          {children}
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
