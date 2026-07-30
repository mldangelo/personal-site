import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  RESOLVED_THEME_COLOR_ATTRIBUTE,
  THEME_COLOR_META_SELECTOR,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import * as rootLayout from '../layout';

// `next/font/local` only exists as a build-time transform, so importing the
// root layout needs it stubbed. The stub returns the shape `app/fonts.ts`
// destructures and nothing else. `vi.mock` is hoisted above the import above,
// which is why this can be a static import rather than a top-level
// `await import` — `target` here is es2015, which forbids one.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

const LIGHT = readColorToken('--color-bg-alt', 'light');
const DARK = readColorToken('--color-bg-alt', 'dark');

// No `s` flag: `target` here is es2015, which does not have one.
const HEAD =
  /<head>([\s\S]*?)<\/head>/.exec(
    renderToStaticMarkup(createElement(rootLayout.default, { children: null })),
  )?.[1] ?? '';

const NOSCRIPT = /<noscript>([\s\S]*?)<\/noscript>/.exec(HEAD)?.[1] ?? '';

/** Every stylesheet this project writes, as one string. */
function projectStyles(): string {
  const dir = join(process.cwd(), 'app', 'styles');
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.css'))
    .map((name) => join(dir, name));

  return [join(process.cwd(), 'app', 'tailwind.css'), ...files]
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
}

/**
 * The export shipped with no `theme-color` at all, so mobile browsers painted
 * their chrome from their own default rather than from the page. Then it
 * shipped a media-scoped pair, which described a dark theme no visitor without
 * JavaScript is ever served, and which React rebuilt out from under the
 * bootstrap on every client-side navigation.
 *
 * What ships now is one unscoped light value in `<noscript>` — the whole truth
 * for a reader with no JavaScript — and one script-owned tag that carries the
 * rendered theme for everyone else.
 */
describe('theme-color', () => {
  it('declares one unscoped value, for a reader with no JavaScript', () => {
    expect(NOSCRIPT).toContain('name="theme-color"');
    expect(NOSCRIPT).toContain(`content="${LIGHT}"`);
    expect(NOSCRIPT).not.toContain('media=');
  });

  /**
   * The premise of the line above, re-derived rather than asserted in prose:
   * dark is reached only through `[data-theme]`, which the bootstrap sets, so
   * a reader with no JavaScript gets the light page on every device and the
   * light chrome is the only honest thing to declare for them.
   *
   * If a `prefers-color-scheme` block ever does land in the stylesheets — by
   * hand, or through a Tailwind `dark:` utility, which defaults to that query —
   * this goes red and points at the declaration that has to change with it.
   */
  it('is unscoped because no stylesheet reacts to the device preference', () => {
    expect(projectStyles()).not.toContain('prefers-color-scheme');
    expect(projectStyles()).toContain("[data-theme='dark']");
  });

  it('declares two different colours, so the theme switch does something', () => {
    expect(LIGHT).not.toBe(DARK);
  });

  /**
   * `theme-color` sits directly above the page, and the sticky header tints
   * the page background rather than introducing its own surface. Reading
   * `--color-bg` instead would put the raised-surface colour next to the
   * page's.
   */
  it('uses the page background, not the raised surface', () => {
    expect(HEAD).not.toContain(readColorToken('--color-bg', 'light'));
    expect(HEAD).not.toContain(readColorToken('--color-bg', 'dark'));
  });

  /**
   * The reason the fallback is in `<noscript>` and not in `viewport.themeColor`.
   * React re-creates its hoisted `<meta>` elements on every client-side
   * navigation and matches them back up by `content` and `name` but never by
   * `media`, so a React-owned `theme-color` tag claims the script-owned one and
   * then destroys it on the first `<Link>` press. Nothing React renders may be
   * a `theme-color` tag.
   */
  it('renders no theme-color meta React could own', () => {
    // `viewport.themeColor` is the only route from this file to a hoisted
    // `theme-color` element, so the absence of the export *is* the property —
    // and Next's own metadata does not appear in this render, which is why the
    // markup cannot be asked instead.
    expect('viewport' in rootLayout).toBe(false);
    expect(HEAD.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')).not.toContain(
      '<meta name="theme-color"',
    );
  });

  describe('bootstrap', () => {
    /**
     * A literal `<script>` with the body inline, which is the only kind that
     * runs before the page is painted. `<Script strategy="beforeInteractive">`
     * looks like it should be — it is what this used to be — but in the App
     * Router it serialises the body into `self.__next_s` for Next's
     * `appBootstrap` to run once the client chunks have loaded, which is long
     * after first paint. Nothing else in the head is deferred like that, so
     * this assertion is the only place the distinction is visible.
     */
    it('ships the theme bootstrap as a parser-blocking inline script', () => {
      expect(HEAD).toMatch(/<script id="theme-init">\(function\(\)\{/);
      expect(HEAD).not.toContain('__next_s');
    });

    it('carries both chrome colours and creates the tag that holds one', () => {
      // Read at build from the same token the fallback above declares, so the
      // scripted value and the no-JavaScript value cannot disagree.
      expect(HEAD).toContain(JSON.stringify(LIGHT));
      expect(HEAD).toContain(JSON.stringify(DARK));
      // That the tag is unscoped and lands first is behaviour, not text, so it
      // is pinned by running this script in `src/lib/__tests__/theme.test.ts`
      // rather than by reading the minified body for a method name.
      expect(HEAD).toContain(RESOLVED_THEME_COLOR_ATTRIBUTE);
    });

    it('queries no tag it did not create', () => {
      // Repointing the page's own tags is the mechanism this replaced; a
      // bootstrap that goes looking for them again has gone back to it.
      expect(HEAD).not.toContain(THEME_COLOR_META_SELECTOR);
    });
  });
});
