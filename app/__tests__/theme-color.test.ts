import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { THEME_COLOR_META_SELECTOR } from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import RootLayout, { viewport } from '../layout';

// `next/font/local` only exists as a build-time transform, so importing the
// root layout for its `viewport` export needs it stubbed. The stub returns the
// shape `app/fonts.ts` destructures and nothing else. `vi.mock` is hoisted
// above the import above, which is why this can be a static import rather than
// a top-level `await import` — `target` here is es2015, which forbids one.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

const LIGHT = readColorToken('--color-bg-alt', 'light');
const DARK = readColorToken('--color-bg-alt', 'dark');

/**
 * The export shipped with no `theme-color` at all, so mobile browsers painted
 * their chrome from their own default rather than from the page. A single
 * unscoped value only fixes that for one of the two themes, which is why this
 * pins the media-scoped pair rather than merely pinning that a value exists.
 *
 * The pair is scoped by the *device* preference, which is not what this site
 * themes off — `<html data-theme>` is, and a visitor can pin it against the
 * device. So the pair is what the page ships for a reader with no JavaScript,
 * and the bootstrap below repoints it at the rendered theme for everyone else.
 */
describe('theme-color', () => {
  const themeColor = viewport.themeColor;

  it('declares one media-scoped value per colour scheme', () => {
    expect(Array.isArray(themeColor)).toBe(true);
    expect(themeColor).toEqual([
      { media: '(prefers-color-scheme: light)', color: LIGHT },
      { media: '(prefers-color-scheme: dark)', color: DARK },
    ]);
  });

  it('declares two different colours, so the scoping does something', () => {
    expect(LIGHT).not.toBe(DARK);
  });

  /**
   * `theme-color` sits directly above the page, and the sticky header tints
   * the page background rather than introducing its own surface. Reading
   * `--color-bg` instead would put the raised-surface colour next to the
   * page's.
   */
  it('uses the page background, not the raised surface', () => {
    const values = (
      themeColor as ReadonlyArray<{ media?: string; color: string }>
    ).map((entry) => entry.color);

    expect(values).not.toContain(readColorToken('--color-bg', 'light'));
    expect(values).not.toContain(readColorToken('--color-bg', 'dark'));
  });

  describe('bootstrap', () => {
    // No `s` flag: `target` here is es2015, which does not have one.
    const head = /<head>([\s\S]*?)<\/head>/.exec(
      renderToStaticMarkup(createElement(RootLayout, { children: null })),
    )?.[1];

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
      expect(head).toMatch(/<script id="theme-init">\(function\(\)\{/);
      expect(head).not.toContain('__next_s');
    });

    it('carries both chrome colours and the tags they belong to', () => {
      // Read at build from the same token the pair above declares, so the
      // scripted value and the no-JavaScript value cannot disagree.
      expect(head).toContain(JSON.stringify(LIGHT));
      expect(head).toContain(JSON.stringify(DARK));
      expect(head).toContain(THEME_COLOR_META_SELECTOR);
    });
  });
});
