import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { SiteSchema } from '@/components/Schema';
import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import ScrollToTop from '@/components/Template/ScrollToTop';
import { sharedOpenGraph, sharedTwitter } from '@/lib/metadata';
import { readColorToken } from '@/lib/tokens';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';
import { bricolage, jetbrainsMono, newsreader } from './fonts';
import './tailwind.css';

/**
 * `theme-color` paints the browser's own chrome — the Android address bar, the
 * Safari toolbar — so it has to be the colour immediately under it, which is
 * the page background the sticky header tints. One unscoped value is wrong in
 * whichever theme it was not picked for, so both are declared and scoped by
 * `prefers-color-scheme`. The values are read from the stylesheets at build
 * time rather than typed here, so they cannot drift from the tokens.
 */
export const viewport: Viewport = {
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: readColorToken('--color-bg-alt', 'light'),
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: readColorToken('--color-bg-alt', 'dark'),
    },
  ],
};

/**
 * The icon set and the web app manifest are not declared here. They come from
 * Next's file conventions — `app/favicon.ico`, `app/icon.png`,
 * `app/apple-icon.png`, `app/manifest.json` — which emit their own `<link>`
 * tags with content-hashed hrefs. Declaring `metadata.icons` would *replace*
 * those convention-derived links rather than add to them, the same way a
 * route-level `openGraph` replaces the inherited one. All four are generated
 * by `npm run icons`; see `scripts/generate-icons.mjs`.
 */
export const metadata: Metadata = {
  title: {
    default: AUTHOR_NAME,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    'OpenAI',
    'Promptfoo',
    'Codex Security',
    'AI security',
    'application security',
    'LLM security',
    'machine learning',
    'startup founder',
    'YC',
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  // The root is the origin of the share metadata, so it uses the same shared
  // blocks as every other page. Hand-writing them here is what left the
  // homepage advertising a different og:image:alt from the rest of the site
  // for the identical image.
  openGraph: {
    ...sharedOpenGraph,
    type: 'website',
    url: `${SITE_URL}/`,
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    ...sharedTwitter,
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
  },
  // Only the snippet/preview hints are declared globally. `index, follow` is
  // already the default, and emitting it here meant every page that sets
  // `noindex` — the 404, the legacy post route — shipped with contradictory
  // robots tags that a crawler is free to resolve either way.
  robots: {
    googleBot: {
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* CSP-safe theme initialization - prevents flash on load */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=window.localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})();`}
        </Script>
        <SiteSchema />
      </head>
      <body>
        {/* First focusable element on the page. The About and Resume pages
            are thousands of pixels long, so tabbing past the nav to reach
            content is otherwise the only route in. */}
        <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
          Skip to content
        </a>
        <ScrollToTop />
        <div className="site-wrapper">
          <Navigation />
          {children}
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
