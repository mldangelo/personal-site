import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DARK_SCHEME_QUERY,
  nextThemeChoice,
  readStoredThemeChoice,
  resolveTheme,
  storeThemeChoice,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_CHOICES,
  THEME_STORAGE_KEY,
  type ThemeChoice,
  themeInitScript,
} from '../theme';

/** Runs the bootstrap the way a browser does: as a script against this DOM. */
function runThemeInitScript(): void {
  new Function(themeInitScript())();
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

  afterEach(clearRoot);

  describe('nextThemeChoice', () => {
    it('cycles system to light to dark and back', () => {
      expect(nextThemeChoice('system')).toBe('light');
      expect(nextThemeChoice('light')).toBe('dark');
      expect(nextThemeChoice('dark')).toBe('system');
    });

    it('walks in the order THEME_CHOICES documents', () => {
      const walked: ThemeChoice[] = [];
      let cursor: ThemeChoice = 'system';

      for (let step = 0; step < THEME_CHOICES.length; step += 1) {
        walked.push(cursor);
        cursor = nextThemeChoice(cursor);
      }

      expect(walked).toEqual(THEME_CHOICES);
      expect(cursor).toBe('system');
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
  });
});
