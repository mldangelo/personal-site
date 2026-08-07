import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Footer from '@/components/layout/footer';
import Navigation from '@/components/layout/navigation';
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE
} from '@/lib/site';
import { geistMono, geistSans, newsreader } from '@/styles/fonts';
import '@/styles/theme.css';
import ThemeSync from './theme-sync';

// The font variables must land on <html>, not on a wrapper element: theme.css
// declares --font-sans/serif/mono at :root, and a var() that cannot resolve
// where it is declared poisons the whole declaration for every descendant.
const fontVariables = `${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`;

// Runs before first paint so the correct theme is applied without a flash.
// Must stay in sync with the persisted shape of src/store/theme-store.ts.
const themeInitScript = `
(function () {
  try {
    var raw = localStorage.getItem('theme-store');
    var pref = 'system';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.preference) {
        pref = parsed.state.preference;
      }
    }
    var dark = pref === 'dark' || (pref === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

// metadataBase lets every page declare a relative canonical and a relative OG
// image; Next absolutizes both against this origin.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Dase.dev',
  appleWebApp: { title: 'Dase.dev' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: '/',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} website social preview`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_PATH]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#15120e' }
  ]
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={fontVariables} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </head>
    <body>
      <ThemeSync />
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="mx-auto w-full max-w-measure flex-1 px-[22px] pb-16 sm:px-10">
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
