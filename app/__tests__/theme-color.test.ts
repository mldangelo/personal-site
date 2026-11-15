import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { themeInitScript } from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import * as rootLayout from '../layout';

// `next/font/local` exists only as a build-time transform, so importing the root
// layout needs a stub with the shape `app/fonts.ts` destructures.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

/**
 * The layout's `<head>`, rendered the way Next's own renderer would.
 *
 * `next/script` reads `appDir` off `HeadManagerContext`, and only that branch
 * emits the App Router's deferred `(self.__next_s=…).push(…)` queue. With no
 * provider, a `beforeInteractive` `<Script>` renders to nothing at all, and an
 * assertion about how the bootstrap was queued could never fail.
 */
const HEAD =
  /<head>([\s\S]*?)<\/head>/.exec(
    renderToStaticMarkup(
      createElement(
        HeadManagerContext.Provider,
        { value: { appDir: true } },
        createElement(rootLayout.default, { children: null }),
      ),
    ),
  )?.[1] ?? '';

const NOSCRIPT = /<noscript>([\s\S]*?)<\/noscript>/.exec(HEAD)?.[1] ?? '';
const BOOTSTRAP =
  /<script id="theme-init">([\s\S]*?)<\/script>/.exec(HEAD)?.[1] ?? '';

describe('theme-color', () => {
  // Without JavaScript the page follows the device, so the chrome does too:
  // each colour scoped by the same media query as the stylesheet's dark branch.
  it('scopes the no-JavaScript chrome colour by the device preference', () => {
    for (const scheme of ['light', 'dark'] as const) {
      expect(NOSCRIPT).toContain(
        `content="${readColorToken('--color-bg-alt', scheme)}" media="(prefers-color-scheme: ${scheme})"`,
      );
    }
    expect(
      readFileSync(join(process.cwd(), 'app', 'tailwind.css'), 'utf8'),
    ).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s*&:where\(:not\(\[data-theme\]\)\)/,
    );
  });

  // React re-creates its hoisted `<meta>` elements on every client-side navigation
  // and matches them up by `content` and `name` but never `media`, so a React-owned
  // `theme-color` tag claims the script-owned one and destroys it on the first
  // `<Link>` press. `viewport.themeColor` is the only route from the layout to such
  // a tag, and Next's metadata is absent from this render, so the export is checked.
  it('renders no theme-color meta React could own', () => {
    expect('viewport' in rootLayout).toBe(false);
    expect(HEAD.replace(NOSCRIPT, '')).not.toContain('name="theme-color"');
  });

  // Only a literal inline `<script>` runs before first paint. `<Script
  // strategy="beforeInteractive">` serialises the body into `self.__next_s`, which
  // Next's client bootstrap runs once its chunks have loaded.
  it('ships the theme bootstrap as a parser-blocking inline script', () => {
    expect(BOOTSTRAP).toBe(
      themeInitScript({
        light: readColorToken('--color-bg-alt', 'light'),
        dark: readColorToken('--color-bg-alt', 'dark'),
      }),
    );
    expect(HEAD).not.toContain('__next_s');
  });
});
