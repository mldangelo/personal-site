import type { Metadata } from 'next';

import { SiteSchema } from '@/components/Schema';
import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import ScrollToTop from '@/components/Template/ScrollToTop';
import { sharedOpenGraph, sharedTwitter } from '@/lib/metadata';
import {
  THEME_COLOR_TOKEN,
  type ThemeColors,
  themeInitScript,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';
import { bricolage, jetbrainsMono, newsreader } from './fonts';
import './tailwind.css';

/**
 * The colour immediately under the browser's own chrome, per theme, read from
 * the stylesheets at build time rather than typed here so it cannot drift from
 * the tokens. `--color-bg-alt` is the page background the sticky header tints;
 * `--color-bg` is the raised surface and would put two colours side by side.
 */
const CHROME_COLORS: ThemeColors = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

/**
 * The chrome colour for a visitor with no JavaScript, and for nobody else.
 *
 * `theme-color` paints the browser's own chrome — the Android address bar, the
 * Safari toolbar — and cannot be styled, so it can only be scoped by
 * `prefers-color-scheme`. That is the *device* preference, and no stylesheet
 * here reacts to it: dark is reached only through `<html data-theme='dark'>`,
 * which the bootstrap below sets. So a scoped pair painted dark chrome over a
 * light page for a no-JavaScript visitor on a dark-preferring device — it
 * described a dark theme they were never served.
 * `app/__tests__/theme-color.test.ts` re-derives that premise from the
 * stylesheets rather than trusting this comment.
 *
 * One unscoped light value is therefore the whole truth without JavaScript:
 * that is the only page a reader can get, on any device. `app/manifest.json`
 * says the same thing with its single `theme_color`.
 *
 * It lives in `<noscript>` because React must not own it. React re-creates its
 * hoisted `<meta>` elements on every client-side navigation and matches them
 * back up by `content`, `name`, `property`, `http-equiv` and `charset` — never
 * `media` — so any React-rendered `theme-color` tag whose colour can equal a
 * rendered theme will claim the script-owned tag instead and then destroy it on
 * the next `<Link>` press. Measured before this changed: React owned the
 * `media=light` node while it carried the dark colour. `<noscript>` puts the
 * fallback exactly where it applies and nowhere React can reach.
 *
 * Interpolated straight into markup because `readColorToken` refuses anything
 * that is not a literal hex, so the value cannot carry a quote or a tag.
 */
const NO_SCRIPT_THEME_COLOR = `<meta name="theme-color" content="${CHROME_COLORS.light}">`;

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
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_THEME_COLOR }} />
        {/* Theme bootstrap — prevents flash on load, stamps the *choice*
            alongside the resolved theme so the header's theme control can
            render its own state from the HTML instead of waiting for
            hydration, and prepends the one `theme-color` tag that carries that
            same theme. Built from the same constants the control uses.

            A plain inline script, not `<Script strategy="beforeInteractive">`:
            in the App Router that strategy serialises the body into
            `self.__next_s` and Next's `appBootstrap` runs it once the client
            chunks have loaded, which is long after first paint. Only a
            parser-blocking script runs before the page is painted, which is
            the entire point of this one. */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript(CHROME_COLORS) }}
        />
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
