import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyThemeColor,
  DARK_SCHEME_QUERY,
  RESOLVED_THEME_COLOR_SELECTOR,
  renderedThemeColor,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
  type ThemeColors,
  themeInitScript,
} from '../theme-color';
import { readColorToken } from '../tokens';

const COLORS: ThemeColors = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

const injected: Element[] = [];

function setPrefersDark(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: prefersDark && query === DARK_SCHEME_QUERY,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

function runBootstrap(): void {
  new Function(themeInitScript(COLORS))();
}

function addTokenStyles(): void {
  const style = document.createElement('style');
  style.textContent =
    `:root{${THEME_COLOR_TOKEN}:${COLORS.light};}` +
    `[${THEME_ATTRIBUTE}='dark']{${THEME_COLOR_TOKEN}:${COLORS.dark};}`;
  document.head.append(style);
  injected.push(style);
}

function addReactOwnedPair(): Element[] {
  return (['light', 'dark'] as const).map((theme) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('media', `(prefers-color-scheme: ${theme})`);
    meta.setAttribute('content', COLORS[theme]);
    document.head.append(meta);
    injected.push(meta);
    return meta;
  });
}

function resolvedColor(): string | null {
  return (
    document
      .querySelector(RESOLVED_THEME_COLOR_SELECTOR)
      ?.getAttribute('content') ?? null
  );
}

function paintedColor(prefersDark: boolean): string | null {
  const matchingMedia = `(prefers-color-scheme: ${
    prefersDark ? 'dark' : 'light'
  })`;

  for (const meta of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
    const media = meta.getAttribute('media');
    if (media === null || media === matchingMedia) {
      return meta.getAttribute('content');
    }
  }

  return null;
}

describe('theme-color runtime', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    setPrefersDark(false);
  });

  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    for (const node of injected.splice(0)) node.remove();
    for (const node of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
      node.remove();
    }
  });

  describe('bootstrap', () => {
    it('uses a saved site choice even when it disagrees with the device', () => {
      setPrefersDark(true);
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

      runBootstrap();

      expect(document.documentElement).toHaveAttribute(
        THEME_ATTRIBUTE,
        'light',
      );
      expect(resolvedColor()).toBe(COLORS.light);
    });

    it('follows the device when no valid choice is saved', () => {
      setPrefersDark(true);

      runBootstrap();

      expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
      expect(resolvedColor()).toBe(COLORS.dark);
    });

    it('still resolves the device theme when storage throws', () => {
      const storage = Object.getOwnPropertyDescriptor(window, 'localStorage');
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: {
          getItem: () => {
            throw new Error('denied');
          },
        },
      });
      setPrefersDark(true);

      try {
        runBootstrap();
        expect(document.documentElement).toHaveAttribute(
          THEME_ATTRIBUTE,
          'dark',
        );
      } finally {
        if (storage) Object.defineProperty(window, 'localStorage', storage);
      }
    });

    it('creates one first, unscoped, script-owned tag', () => {
      addReactOwnedPair();

      runBootstrap();

      const metas = [...document.querySelectorAll(THEME_COLOR_META_SELECTOR)];
      expect(metas).toHaveLength(3);
      expect(metas[0].matches(RESOLVED_THEME_COLOR_SELECTOR)).toBe(true);
      expect(metas[0]).not.toHaveAttribute('media');
    });
  });

  describe('client synchronization', () => {
    it('reads the rendered theme from the page-background token', () => {
      addTokenStyles();

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
      expect(renderedThemeColor(document)).toBe(COLORS.dark);

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
      expect(renderedThemeColor(document)).toBe(COLORS.light);
    });

    it('updates only its own tag', () => {
      const pair = addReactOwnedPair();

      applyThemeColor(document, COLORS.dark);

      expect(resolvedColor()).toBe(COLORS.dark);
      expect(pair.map((meta) => meta.getAttribute('content'))).toEqual([
        COLORS.light,
        COLORS.dark,
      ]);
    });

    it('survives route metadata being hoisted after a theme change', () => {
      addTokenStyles();
      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
      syncThemeColor(document);

      // This is the relevant effect of a client navigation: React adds or
      // re-creates the metadata it owns from the next route payload.
      addReactOwnedPair();

      expect(resolvedColor()).toBe(COLORS.dark);
      expect(paintedColor(false)).toBe(COLORS.dark);
      expect(paintedColor(true)).toBe(COLORS.dark);
    });

    it('does nothing when the stylesheet token has not resolved', () => {
      syncThemeColor(document);
      expect(document.querySelector(RESOLVED_THEME_COLOR_SELECTOR)).toBeNull();
    });
  });
});
