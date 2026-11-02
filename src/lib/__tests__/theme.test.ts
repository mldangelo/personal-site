import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyThemeColor,
  DARK_SCHEME_QUERY,
  RESOLVED_THEME_COLOR_SELECTOR,
  readStoredThemeChoice,
  readSystemScheme,
  storeThemeChoice,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
  themeInitScript,
} from '../theme';
import { readColorToken } from '../tokens';

// The cycle, what each choice stores, and how a choice resolves are exercised end
// to end by `ThemeToggle.test.tsx`. This covers the bootstrap and its tag.
const CHROME_COLORS = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

const root = document.documentElement;

/** Runs the bootstrap the way a browser does: as a script against this DOM. */
function runThemeInitScript(): void {
  new Function(themeInitScript(CHROME_COLORS))();
}

/** A media-scoped pair in `<head>`, as a fork's `viewport.themeColor` hoists. */
function addThemeColorMetas(): Element[] {
  return (['light', 'dark'] as const).map((scheme) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('media', `(prefers-color-scheme: ${scheme})`);
    meta.setAttribute('content', CHROME_COLORS[scheme]);
    document.head.append(meta);
    return meta;
  });
}

function chromeColors(): (string | null)[] {
  return [...document.querySelectorAll(THEME_COLOR_META_SELECTOR)].map((meta) =>
    meta.getAttribute('content'),
  );
}

function setDevice(device: 'light' | 'dark' | null): void {
  window.matchMedia = (device &&
    ((query: string) => ({
      matches: device === 'dark' && query === DARK_SCHEME_QUERY,
    }))) as typeof window.matchMedia;
}

describe('theme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setDevice('light');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    root.removeAttribute(THEME_ATTRIBUTE);
    root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
    for (const node of document.head.querySelectorAll('meta')) {
      node.remove();
    }
  });

  // The script cannot import the parser, so this is what keeps its copy of the
  // parsing from drifting away from `readStoredThemeChoice`.
  it.each([
    [null, 'system'],
    ['light', 'light'],
    ['dark', 'dark'],
    ['system', 'system'],
    ['sepia', 'system'],
    ['', 'system'],
  ])(
    'reads stored %j as %s in both the bootstrap and the client',
    (stored, choice) => {
      if (stored !== null)
        window.localStorage.setItem(THEME_STORAGE_KEY, stored);

      runThemeInitScript();

      expect(readStoredThemeChoice()).toBe(choice);
      expect(root.getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe(choice);
    },
  );

  it.each([
    ['light', null, 'light'],
    ['dark', null, 'dark'],
    // With no `matchMedia` to ask, the bootstrap paints light.
    [null, null, 'light'],
    // A stored choice beats the device, in the chrome as much as the page.
    ['dark', 'light', 'light'],
  ] as const)(
    'on a %s device with %s stored, stamps and paints %s',
    (device, stored, theme) => {
      setDevice(device);
      if (stored) window.localStorage.setItem(THEME_STORAGE_KEY, stored);

      runThemeInitScript();

      expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
      expect(chromeColors()).toEqual([CHROME_COLORS[theme]]);
      // The client reads the device the same way the bootstrap did.
      expect(readSystemScheme()).toBe(device);
    },
  );

  it('still resolves a theme when storage throws', () => {
    // Reaching into it throws, as blocked site data does.
    vi.stubGlobal('localStorage', null);
    setDevice('dark');

    runThemeInitScript();

    expect(root.getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(readStoredThemeChoice()).toBe('system');
    expect(() => storeThemeChoice('dark')).not.toThrow();
  });

  // Unscoped so it always matches, first so it always wins. React rebuilds the
  // tags it owns on navigation, so those are never written to.
  it.each([
    ['the bootstrap', runThemeInitScript],
    ['applyThemeColor', () => applyThemeColor(document, CHROME_COLORS.dark)],
  ])(
    '%s adds one unscoped tag ahead of the page tags, untouched',
    (_who, add) => {
      const pair = addThemeColorMetas();

      add();

      const [first, ...others] = document.querySelectorAll(
        THEME_COLOR_META_SELECTOR,
      );
      expect(first).not.toHaveAttribute('media');
      expect(first.matches(RESOLVED_THEME_COLOR_SELECTOR)).toBe(true);
      expect(others).toEqual(pair);
      expect(others.map((meta) => meta.getAttribute('content'))).toEqual([
        CHROME_COLORS.light,
        CHROME_COLORS.dark,
      ]);
    },
  );

  it('writes to the tag the bootstrap created rather than adding a second', () => {
    // The script cannot import the selector it is built from, so this is what
    // keeps the created tag and the written tag the same tag.
    runThemeInitScript();

    applyThemeColor(document, CHROME_COLORS.dark);
    applyThemeColor(document, CHROME_COLORS.light);

    expect(chromeColors()).toEqual([CHROME_COLORS.light]);
  });

  it('adds no tag when no token resolves, leaving the declared fallback', () => {
    // An empty `content` is skipped by the browser, which would then fall back
    // to its default chrome rather than the fallback already here.
    addThemeColorMetas();

    syncThemeColor(document);

    expect(chromeColors()).toEqual([CHROME_COLORS.light, CHROME_COLORS.dark]);
  });
});
