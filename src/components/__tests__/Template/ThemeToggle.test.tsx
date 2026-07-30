import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DARK_SCHEME_QUERY,
  RESOLVED_THEME_COLOR_SELECTOR,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
  themeInitScript,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import ThemeToggle from '../../Template/ThemeToggle';

const SYSTEM_LABEL = 'Theme: system. Switch to light.';
const LIGHT_LABEL = 'Theme: light. Switch to dark.';
const DARK_LABEL = 'Theme: dark. Switch to system.';

/** A `matchMedia` stand-in whose preference can be flipped mid-test. */
function stubColorScheme(prefersDark: boolean) {
  const listeners = new Set<() => void>();
  let matches = prefersDark;

  const media = {
    get matches() {
      return matches;
    },
    media: DARK_SCHEME_QUERY,
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener);
    },
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn(() => media),
  });

  return {
    /** What a device switching theme at sunset looks like. */
    flipTo(next: boolean) {
      matches = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

function root() {
  return document.documentElement;
}

function clearRoot() {
  root().removeAttribute(THEME_ATTRIBUTE);
  root().removeAttribute(THEME_CHOICE_ATTRIBUTE);
}

function toggle() {
  return screen.getByRole('button');
}

/** The stylesheet that decides which state is visible, read from source. */
const NAVIGATION_CSS = readFileSync(
  join(process.cwd(), 'app/styles/layout/navigation.css'),
  'utf8',
);

/** The real chrome colours, one per theme, as `app/layout.tsx` reads them. */
const CHROME_COLORS = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
} as const;

const unhydrated: Element[] = [];

/**
 * Mounts the server markup with the real stylesheet and no React at all, which
 * is what a visitor sees between first paint and hydration.
 */
function renderUnhydrated(choice: string | null): Element {
  const style = document.createElement('style');
  style.textContent = NAVIGATION_CSS;
  document.head.appendChild(style);
  unhydrated.push(style);

  const host = document.createElement('div');
  host.innerHTML = renderToStaticMarkup(<ThemeToggle />);
  document.body.appendChild(host);
  unhydrated.push(host);

  if (choice !== null) root().setAttribute(THEME_CHOICE_ATTRIBUTE, choice);

  const button = host.querySelector('button.theme-toggle');
  if (!button) throw new Error('no theme toggle in the server markup');

  return button;
}

/**
 * The `<head>` a real page has: the token declarations `data-theme` switches
 * between, and the `theme-color` tag the pre-paint bootstrap prepends.
 *
 * The bootstrap is run rather than imitated, because the tag it creates is the
 * one the component then writes to — a stand-in could agree with the component
 * while disagreeing with what actually ships.
 */
function renderHead(): void {
  const style = document.createElement('style');
  style.textContent =
    `:root{${THEME_COLOR_TOKEN}:${CHROME_COLORS.light};}` +
    `[${THEME_ATTRIBUTE}='dark']{${THEME_COLOR_TOKEN}:${CHROME_COLORS.dark};}`;
  document.head.append(style);
  unhydrated.push(style);

  new Function(themeInitScript(CHROME_COLORS))();
}

/**
 * The tags React hoists for a `viewport.themeColor` declaration, re-created
 * from the build-time payload the way a client-side navigation re-creates them.
 */
function hoistThemeColorPair(): Element[] {
  return (['light', 'dark'] as const).map((scheme) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('media', `(prefers-color-scheme: ${scheme})`);
    meta.setAttribute('content', CHROME_COLORS[scheme]);
    document.head.append(meta);
    unhydrated.push(meta);
    return meta;
  });
}

/** What the address bar is painted with, according to every tag on the page. */
function chromeColors(): string[] {
  return [...document.querySelectorAll(THEME_COLOR_META_SELECTOR)].map(
    (meta) => meta.getAttribute('content') ?? '',
  );
}

/**
 * What the browser would paint, modelled the way the spec reads it: the first
 * tag in tree order that carries no `media` or whose `media` matches.
 */
function paintedChromeColor(prefersDark: boolean): string | null {
  const query = `(prefers-color-scheme: ${prefersDark ? 'dark' : 'light'})`;

  for (const meta of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
    const media = meta.getAttribute('media');
    if (media === null || media === query) return meta.getAttribute('content');
  }

  return null;
}

function visibleStates(): (string | null)[] {
  return [...document.querySelectorAll('.theme-toggle-state')]
    .filter((el) => window.getComputedStyle(el).display !== 'none')
    .map((el) => el.getAttribute('data-theme-state'));
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearRoot();
    stubColorScheme(true);
    // A stylesheet that jsdom silently dropped would make the visibility
    // assertions below vacuous.
    expect(NAVIGATION_CSS).toContain('.theme-toggle-state');
  });

  afterEach(() => {
    clearRoot();
    for (const node of unhydrated.splice(0)) node.remove();
    // The bootstrap and the component both create their tag rather than taking
    // one from a helper, so it is not in `unhydrated` to sweep.
    for (const node of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
      node.remove();
    }
  });

  describe('server-rendered markup', () => {
    // The control used to render `<div class="theme-toggle-placeholder" />`
    // until it mounted, because it could not know the theme before then. The
    // resolved choice is on <html> before first paint, so it can.
    it('ships a real button, not a placeholder', () => {
      const html = renderToStaticMarkup(<ThemeToggle />);

      expect(html).toContain('<button');
      expect(html).toContain('class="theme-toggle"');
      expect(html).not.toContain('theme-toggle-placeholder');
    });

    it('ships every state so CSS can pick one without hydrating', () => {
      const html = renderToStaticMarkup(<ThemeToggle />);

      expect(html).toContain('data-theme-state="system"');
      expect(html).toContain('data-theme-state="light"');
      expect(html).toContain('data-theme-state="dark"');
    });

    it('ships a name for each state, so the button is never unnamed', () => {
      const html = renderToStaticMarkup(<ThemeToggle />);

      expect(html).toContain(SYSTEM_LABEL);
      expect(html).toContain(LIGHT_LABEL);
      expect(html).toContain(DARK_LABEL);
    });
  });

  describe('before hydration', () => {
    // The server markup plus the real stylesheet plus the attribute the head
    // bootstrap stamps — no React. This is the whole claim of the component:
    // one icon and one truthful name, with no JavaScript involved.
    it.each([
      ['system', SYSTEM_LABEL],
      ['light', LIGHT_LABEL],
      ['dark', DARK_LABEL],
      // No attribute at all means the bootstrap never ran.
      [null, SYSTEM_LABEL],
    ])('shows one state and names it for choice %s', (choice, label) => {
      const button = renderUnhydrated(choice);

      expect(visibleStates()).toEqual([choice ?? 'system']);
      expect(button).toHaveAccessibleName(label);
    });
  });

  describe('accessible name', () => {
    // `aria-pressed` cannot express three states; the name has to say which of
    // the three is active as well as what a press will do.
    it('names the system state and the next one', () => {
      render(<ThemeToggle />);

      expect(toggle()).toHaveAccessibleName(SYSTEM_LABEL);
    });

    it('names an explicit light choice', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      render(<ThemeToggle />);

      expect(toggle()).toHaveAccessibleName(LIGHT_LABEL);
    });

    it('names an explicit dark choice', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      render(<ThemeToggle />);

      expect(toggle()).toHaveAccessibleName(DARK_LABEL);
    });

    it('offers the same wording as a pointer tooltip', () => {
      render(<ThemeToggle />);

      expect(toggle()).toHaveAttribute('title', SYSTEM_LABEL);
    });
  });

  describe('cycling', () => {
    it('goes system to light to dark and back to system', () => {
      render(<ThemeToggle />);
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');

      fireEvent.click(toggle());
      expect(toggle()).toHaveAccessibleName(LIGHT_LABEL);
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('light');
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');

      fireEvent.click(toggle());
      expect(toggle()).toHaveAccessibleName(DARK_LABEL);
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('dark');
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');

      fireEvent.click(toggle());
      expect(toggle()).toHaveAccessibleName(SYSTEM_LABEL);
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
    });

    it('stores an explicit choice and clears it again for system', () => {
      // The first click used to pin a theme in localStorage with no route back
      // to following the device.
      render(<ThemeToggle />);

      fireEvent.click(toggle());
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

      fireEvent.click(toggle());
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

      fireEvent.click(toggle());
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    });

    it('starts from the stored choice rather than from scratch', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      render(<ThemeToggle />);

      fireEvent.click(toggle());

      expect(toggle()).toHaveAccessibleName(SYSTEM_LABEL);
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    });
  });

  describe('following the device', () => {
    it('paints the device theme while the choice is system', () => {
      render(<ThemeToggle />);

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    });

    it('repaints when the device flips, with no reload', () => {
      const media = stubColorScheme(false);
      render(<ThemeToggle />);
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');

      media.flipTo(true);

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
    });

    it('ignores the device once a theme is chosen explicitly', () => {
      const media = stubColorScheme(false);
      render(<ThemeToggle />);

      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');

      media.flipTo(true);

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');
    });

    it('re-adopts the device when cycled back to system', () => {
      const media = stubColorScheme(false);
      render(<ThemeToggle />);

      // Pin light, then dark, then hand control back.
      fireEvent.click(toggle());
      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');

      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');

      media.flipTo(true);
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    });

    it('repaints the browser chrome when the device flips', () => {
      // A media-scoped tag would follow this on its own, but the tag that
      // carries the rendered theme is unscoped by design — so nothing but this
      // moves it, and a stale reading would last the rest of the visit.
      const media = stubColorScheme(false);
      renderHead();
      render(<ThemeToggle />);
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.light);

      media.flipTo(true);

      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });

    it('leaves the bootstrap theme alone when the device cannot be read', () => {
      // Guessing light here is exactly the flash the bootstrap exists to avoid.
      root().setAttribute(THEME_ATTRIBUTE, 'dark');
      root().setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      render(<ThemeToggle />);

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
    });
  });

  describe('browser chrome', () => {
    // The address bar and the toolbar are painted from `theme-color`, which
    // cannot be styled and can only be scoped by the device preference. A
    // visitor who picks a theme is saying the device preference does not apply
    // to this page, so every change of `data-theme` has to be carried across.
    it('follows a chosen theme against the device', () => {
      stubColorScheme(true);
      renderHead();
      render(<ThemeToggle />);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);

      // system -> light, on a device that prefers dark.
      fireEvent.click(toggle());

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.light);
    });

    it('hands the chrome back to the device on the way round to system', () => {
      const media = stubColorScheme(false);
      renderHead();
      render(<ThemeToggle />);

      // system -> light -> dark, pinned against a light device.
      fireEvent.click(toggle());
      fireEvent.click(toggle());
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);

      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.light);

      media.flipTo(true);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });

    it('never names a colour the page is not painted with', () => {
      stubColorScheme(true);
      renderHead();
      render(<ThemeToggle />);

      for (let press = 0; press < 6; press += 1) {
        const painted =
          root().getAttribute(THEME_ATTRIBUTE) === 'dark'
            ? CHROME_COLORS.dark
            : CHROME_COLORS.light;

        expect(paintedChromeColor(true)).toBe(painted);
        fireEvent.click(toggle());
      }
    });

    it('paints from exactly one tag, however many the page ships', () => {
      // Repointing the page's own tags left React unable to match its hoisted
      // metas back up — it keys them by `content` — so it built another and the
      // live document carried three where the export declared two.
      stubColorScheme(true);
      renderHead();
      hoistThemeColorPair();
      render(<ThemeToggle />);

      expect(
        document.querySelectorAll(RESOLVED_THEME_COLOR_SELECTOR),
      ).toHaveLength(1);
      expect(chromeColors()[0]).toBe(CHROME_COLORS.dark);
    });

    /**
     * The bug this file did not catch: `syncThemeColor` runs on `[choice,
     * systemScheme]`, and neither changes on a client-side navigation — but
     * React re-creates every hoisted `<meta>` from the build-time payload on
     * each one. Anything written into those tags is reverted by the first
     * `<Link>` press, and it was: measured in Chrome against the export, a
     * light device with dark pinned had the light chrome colour painted back
     * over a dark page and kept it for the rest of the session.
     */
    it('survives a navigation that rebuilds the tags React owns', () => {
      stubColorScheme(false);
      renderHead();
      const pair = hoistThemeColorPair();
      render(<ThemeToggle />);

      // system -> light -> dark: dark pinned on a light-preferring device,
      // which is the direction that broke.
      fireEvent.click(toggle());
      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);

      // A client transition: the same tags, destroyed and rebuilt from the
      // build-time values, with no state change to re-run the effect.
      for (const meta of pair) meta.remove();
      hoistThemeColorPair();

      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);
      expect(paintedChromeColor(true)).toBe(CHROME_COLORS.dark);
    });

    it('leaves the declared fallback in place when no token resolves', () => {
      // No stylesheet — a fork mid-rename, or styles that failed to load.
      // Degrading to what the document declares beats naming a colour from a
      // palette that is not on the page.
      hoistThemeColorPair();

      render(<ThemeToggle />);
      fireEvent.click(toggle());

      expect(chromeColors()).toEqual([CHROME_COLORS.light, CHROME_COLORS.dark]);
    });
  });
});
