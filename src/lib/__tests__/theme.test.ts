import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyThemeColor,
  DARK_SCHEME_QUERY,
  nextThemeChoice,
  RESOLVED_THEME_COLOR_SELECTOR,
  readStoredThemeChoice,
  renderedThemeColor,
  resolveTheme,
  storeThemeChoice,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_CHOICES,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
  type ThemeChoice,
  type ThemeColors,
  themeInitScript,
} from '../theme';
import { readColorToken } from '../tokens';

/**
 * The real token values, so this cannot pass against a palette the site does
 * not have. Which token the chrome takes is pinned in `theme-color.test.ts`.
 */
const CHROME_COLORS: ThemeColors = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

/** Runs the bootstrap the way a browser does: as a script against this DOM. */
function runThemeInitScript(): void {
  new Function(themeInitScript(CHROME_COLORS))();
}

const injected: Element[] = [];

/**
 * A media-scoped pair, hoisted into `<head>` the way React hoists the ones a
 * fork might declare through `viewport.themeColor`.
 *
 * The export no longer ships these — its fallback lives in `<noscript>` — but
 * the script-owned tag has to win against them anyway, because that is what
 * makes it durable rather than merely first to run.
 */
function addThemeColorMetas(): Element[] {
  const added = ['light', 'dark'].map((scheme) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('media', `(prefers-color-scheme: ${scheme})`);
    meta.setAttribute('content', CHROME_COLORS[scheme as 'light' | 'dark']);
    document.head.append(meta);
    injected.push(meta);
    return meta;
  });

  return added;
}

/** The content of the one tag the bootstrap and the toggle both write to. */
function resolvedChromeColor(): string | null {
  return (
    document
      .querySelector(RESOLVED_THEME_COLOR_SELECTOR)
      ?.getAttribute('content') ?? null
  );
}

/**
 * What the browser would paint, modelled the way the spec says: the first tag
 * in tree order whose `media` matches, or which carries no `media` at all.
 */
function paintedChromeColor(prefersDark: boolean): string | null {
  for (const meta of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
    const media = meta.getAttribute('media');
    const matches =
      media === null ||
      media === `(prefers-color-scheme: ${prefersDark ? 'dark' : 'light'})`;

    if (matches) return meta.getAttribute('content');
  }

  return null;
}

/**
 * The shape of the real declarations: the token in `:root`, overridden under
 * `[data-theme='dark']`. jsdom resolves custom properties through the cascade,
 * so this exercises the same read the browser does. It is written out rather
 * than loaded from `app/styles/` because the light values live in a Tailwind
 * `@theme` block, which jsdom does not parse.
 */
function addTokenStylesheet(): void {
  const style = document.createElement('style');
  style.textContent =
    `:root{${THEME_COLOR_TOKEN}:${CHROME_COLORS.light};}` +
    `[${THEME_ATTRIBUTE}='dark']{${THEME_COLOR_TOKEN}:${CHROME_COLORS.dark};}`;
  document.head.append(style);
  injected.push(style);
}

function chromeColors(): string[] {
  return [...document.querySelectorAll('meta[name="theme-color"]')].map(
    (meta) => meta.getAttribute('content') ?? '',
  );
}

function setPrefersDark(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: prefersDark && query === DARK_SCHEME_QUERY,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  });
}

/** A storage that rejects every access, as Safari private browsing can. */
function withThrowingStorage(run: () => void): void {
  const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
  const deny = () => {
    throw new Error('storage denied');
  };

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: { getItem: deny, setItem: deny, removeItem: deny },
  });

  try {
    run();
  } finally {
    if (original) Object.defineProperty(window, 'localStorage', original);
  }
}

function choiceAttribute(): string | null {
  return document.documentElement.getAttribute(THEME_CHOICE_ATTRIBUTE);
}

function themeAttribute(): string | null {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE);
}

function clearRoot(): void {
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  document.documentElement.removeAttribute(THEME_CHOICE_ATTRIBUTE);
}

describe('theme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearRoot();
    setPrefersDark(false);
  });

  afterEach(() => {
    clearRoot();
    for (const node of injected.splice(0)) node.remove();
    // The script-owned tag is created by the code under test rather than by a
    // helper, so it is not in `injected` and has to be swept separately.
    for (const node of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
      node.remove();
    }
  });

  describe('nextThemeChoice', () => {
    it('cycles system to light to dark and back', () => {
      expect(nextThemeChoice('system')).toBe('light');
      expect(nextThemeChoice('light')).toBe('dark');
      expect(nextThemeChoice('dark')).toBe('system');
    });

    it('reaches every state from every state, so none is a dead end', () => {
      for (const start of THEME_CHOICES) {
        const seen = new Set<ThemeChoice>([start]);
        let cursor = start;

        for (let step = 1; step < THEME_CHOICES.length; step += 1) {
          cursor = nextThemeChoice(cursor);
          seen.add(cursor);
        }

        expect(seen.size).toBe(THEME_CHOICES.length);
        expect(nextThemeChoice(cursor)).toBe(start);
      }
    });
  });

  describe('THEME_CHOICES', () => {
    // Two literals hold one order: this array and the `nextThemeChoice` map.
    // Nothing else notices when they disagree — the rendered states are picked
    // by CSS from `data-theme-choice`, so their DOM order is unobservable, and
    // reversing this array leaves every other test in the suite green.
    it('is nextThemeChoice walked from the un-chosen state', () => {
      // Nothing stored, per `beforeEach`: where a first-time visitor starts.
      const start = readStoredThemeChoice();
      expect(THEME_CHOICES[0]).toBe(start);

      let cursor = start;
      const walk: ThemeChoice[] = [cursor];

      for (let step = 1; step < THEME_CHOICES.length; step += 1) {
        cursor = nextThemeChoice(cursor);
        walk.push(cursor);
      }

      expect(walk).toEqual([...THEME_CHOICES]);
    });
  });

  describe('resolveTheme', () => {
    it('ignores the device for an explicit choice', () => {
      expect(resolveTheme('light', 'dark')).toBe('light');
      expect(resolveTheme('dark', 'light')).toBe('dark');
    });

    it('follows the device for system', () => {
      expect(resolveTheme('system', 'dark')).toBe('dark');
      expect(resolveTheme('system', 'light')).toBe('light');
    });

    it('resolves to nothing while the device preference is unknown', () => {
      // Rather than guessing light and flashing a dark-mode visitor.
      expect(resolveTheme('system', null)).toBeNull();
    });
  });

  describe('stored choice', () => {
    it('reads a missing key as system', () => {
      expect(readStoredThemeChoice()).toBe('system');
    });

    it('round-trips explicit choices', () => {
      storeThemeChoice('light');
      expect(readStoredThemeChoice()).toBe('light');

      storeThemeChoice('dark');
      expect(readStoredThemeChoice()).toBe('dark');
    });

    it('clears the key for system so no theme stays pinned', () => {
      storeThemeChoice('dark');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

      storeThemeChoice('system');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
      expect(readStoredThemeChoice()).toBe('system');
    });

    it('reads an unrecognised stored value as system', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
      expect(readStoredThemeChoice()).toBe('system');
    });

    it('survives storage that throws', () => {
      withThrowingStorage(() => {
        expect(readStoredThemeChoice()).toBe('system');
        expect(() => storeThemeChoice('dark')).not.toThrow();
      });
    });
  });

  describe('themeInitScript', () => {
    it('stamps system plus the device theme when nothing is stored', () => {
      setPrefersDark(true);
      runThemeInitScript();

      expect(choiceAttribute()).toBe('system');
      expect(themeAttribute()).toBe('dark');
    });

    it('stamps an explicit choice and ignores the device', () => {
      setPrefersDark(true);
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      runThemeInitScript();

      expect(choiceAttribute()).toBe('light');
      expect(themeAttribute()).toBe('light');
    });

    it('agrees with readStoredThemeChoice for every stored value', () => {
      // The script cannot import the parser, so this is the only thing keeping
      // the two readings of localStorage from drifting apart.
      for (const stored of [null, 'light', 'dark', 'system', 'sepia', '']) {
        window.localStorage.clear();
        if (stored !== null) {
          window.localStorage.setItem(THEME_STORAGE_KEY, stored);
        }
        clearRoot();
        runThemeInitScript();

        expect(choiceAttribute()).toBe(readStoredThemeChoice());
      }
    });

    it('still resolves a theme when storage throws', () => {
      // A single try/catch around the whole body shipped a page with no
      // data-theme at all, which is an unstyled flash rather than a fallback.
      setPrefersDark(true);
      withThrowingStorage(runThemeInitScript);

      expect(choiceAttribute()).toBe('system');
      expect(themeAttribute()).toBe('dark');
    });

    it('still resolves a theme when matchMedia is unavailable', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      runThemeInitScript();

      expect(choiceAttribute()).toBe('system');
      expect(themeAttribute()).toBe('light');
    });

    it('paints the chrome from the stored choice, not from the device', () => {
      // The bug: a `theme-color` tag can only be scoped by
      // `prefers-color-scheme`, so a visitor reading in light mode on a dark
      // device got a black address bar over a white page — and the reverse.
      addThemeColorMetas();
      setPrefersDark(true);
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

      runThemeInitScript();

      expect(themeAttribute()).toBe('light');
      expect(resolvedChromeColor()).toBe(CHROME_COLORS.light);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.light);
    });

    it('paints the chrome from the device while the choice is system', () => {
      // Following the device is what `system` means, so the resolved value has
      // to agree with it rather than fight it.
      addThemeColorMetas();
      setPrefersDark(true);

      runThemeInitScript();

      expect(themeAttribute()).toBe('dark');
      expect(resolvedChromeColor()).toBe(CHROME_COLORS.dark);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });

    it('leaves the tags it did not create exactly as it found them', () => {
      // Repointing them is what React undoes on the first client-side
      // navigation, because it matches its own hoisted metas back up by
      // `content` and rebuilds any it cannot find.
      const pair = addThemeColorMetas();
      setPrefersDark(true);

      runThemeInitScript();

      expect(pair.map((meta) => meta.getAttribute('content'))).toEqual([
        CHROME_COLORS.light,
        CHROME_COLORS.dark,
      ]);
    });

    it('adds one unscoped tag, ahead of everything else', () => {
      // Unscoped so it always matches, first so it always wins: those two
      // together are why no navigation and no tag order can unseat it.
      addThemeColorMetas();

      runThemeInitScript();

      const metas = [...document.querySelectorAll(THEME_COLOR_META_SELECTOR)];
      expect(metas).toHaveLength(3);
      expect(metas[0].hasAttribute('media')).toBe(false);
      expect(metas[0].matches(RESOLVED_THEME_COLOR_SELECTOR)).toBe(true);
    });

    it('creates the same tag applyThemeColor writes to', () => {
      // The script cannot import the selector it is built from, so this is the
      // only thing keeping the created tag and the written tag from drifting
      // into two tags — which is what a mismatch would silently become.
      runThemeInitScript();
      applyThemeColor(document, CHROME_COLORS.dark);

      expect(chromeColors()).toEqual([CHROME_COLORS.dark]);
    });

    it('runs on a page with no theme-color tags at all', () => {
      // A fork that drops the `<noscript>` fallback still gets its theme.
      expect(runThemeInitScript).not.toThrow();
      expect(themeAttribute()).toBe('light');
      expect(resolvedChromeColor()).toBe(CHROME_COLORS.light);
    });
  });

  describe('applyThemeColor', () => {
    it('creates one unscoped tag ahead of any the page already has', () => {
      addThemeColorMetas();

      applyThemeColor(document, CHROME_COLORS.dark);

      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });

    it('reuses its own tag rather than adding one per call', () => {
      applyThemeColor(document, CHROME_COLORS.dark);
      applyThemeColor(document, CHROME_COLORS.light);
      applyThemeColor(document, CHROME_COLORS.dark);

      expect(chromeColors()).toEqual([CHROME_COLORS.dark]);
    });

    it('leaves the page it was given untouched', () => {
      // Mutating the tags the document shipped is the mechanism this replaced:
      // React re-creates its own hoisted metas on navigation, so a mutation
      // there lasts until the visitor follows one link.
      const pair = addThemeColorMetas();

      applyThemeColor(document, CHROME_COLORS.dark);

      expect(pair.map((meta) => meta.getAttribute('content'))).toEqual([
        CHROME_COLORS.light,
        CHROME_COLORS.dark,
      ]);
    });

    it('adds no tag at all when no colour resolves', () => {
      // An empty `content` is skipped by the browser, which falls back to its
      // own default chrome — strictly worse than the fallback already here.
      addThemeColorMetas();

      applyThemeColor(document, '');

      expect(document.querySelector(RESOLVED_THEME_COLOR_SELECTOR)).toBeNull();
      expect(chromeColors()).toEqual([CHROME_COLORS.light, CHROME_COLORS.dark]);
    });
  });

  describe('renderedThemeColor', () => {
    it('reads the token the page is actually painted with', () => {
      addTokenStylesheet();

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
      expect(renderedThemeColor(document)).toBe(CHROME_COLORS.dark);

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
      expect(renderedThemeColor(document)).toBe(CHROME_COLORS.light);
    });

    it('reports nothing when the token has not resolved', () => {
      expect(renderedThemeColor(document)).toBe('');
    });
  });

  describe('syncThemeColor', () => {
    it('follows data-theme, which is the only thing the styles follow', () => {
      addTokenStylesheet();

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
      syncThemeColor(document);
      expect(resolvedChromeColor()).toBe(CHROME_COLORS.dark);

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
      syncThemeColor(document);
      expect(resolvedChromeColor()).toBe(CHROME_COLORS.light);
    });

    it('degrades to whatever the page already declares when no token resolves', () => {
      addThemeColorMetas();

      syncThemeColor(document);

      expect(chromeColors()).toEqual([CHROME_COLORS.light, CHROME_COLORS.dark]);
    });

    it('holds its reading while React rebuilds the tags it owns', () => {
      // An App Router client-side navigation destroys and re-creates every
      // hoisted `<meta>`, from the build-time payload. Anything written into
      // one of those is gone; the tag written here is not React's to rebuild.
      addTokenStylesheet();
      const pair = addThemeColorMetas();

      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
      syncThemeColor(document);
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);

      for (const meta of pair) meta.remove();
      addThemeColorMetas();

      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });
  });
});
