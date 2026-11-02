import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

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
  it('declares one unscoped light value for a reader with no JavaScript', () => {
    expect(NOSCRIPT).toContain('name="theme-color"');
    expect(NOSCRIPT).toContain(
      `content="${readColorToken('--color-bg-alt', 'light')}"`,
    );
    expect(NOSCRIPT).not.toContain('media=');
  });

  // Unscoped is honest only while dark is reached solely through `[data-theme]`.
  // A `prefers-color-scheme` block, including one from a Tailwind `dark:` utility,
  // would mean the fallback above has to change with it.
  it('has no stylesheet reacting to the device preference', () => {
    const dir = join(process.cwd(), 'app', 'styles');
    const css = [
      join(process.cwd(), 'app', 'tailwind.css'),
      ...readdirSync(dir, { recursive: true, encoding: 'utf8' })
        .filter((name) => name.endsWith('.css'))
        .map((name) => join(dir, name)),
    ]
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');

    expect(css).not.toContain('prefers-color-scheme');
    expect(css).toContain("[data-theme='dark']");
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
    expect(BOOTSTRAP).toMatch(/^\(function\(\)\{/);
    expect(HEAD).not.toContain('__next_s');
  });

  // The header tints the page background, so the raised surface would sit visibly
  // wrong beside the browser chrome.
  it('builds the bootstrap from the page background, not the raised surface', () => {
    for (const scheme of ['light', 'dark'] as const) {
      expect(BOOTSTRAP).toContain(
        JSON.stringify(readColorToken('--color-bg-alt', scheme)),
      );
      expect(HEAD).not.toContain(readColorToken('--color-bg', scheme));
    }
  });
});
