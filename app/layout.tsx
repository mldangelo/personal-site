import React from 'react';

import type { Metadata } from 'next';
import { Raleway, Source_Sans_3 } from 'next/font/google';

import Analytics from '@/components/Template/Analytics';
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
    default: "Michael D'Angelo",
    template: "%s | Michael D'Angelo",
  },
  description: "Michael D'Angelo's personal website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${raleway.variable}`}>
      <body>
        <Analytics />
        <div id="wrapper">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
