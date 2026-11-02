import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useLayoutEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  RESOLVED_THEME_COLOR_SELECTOR,
  type ResolvedTheme,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_CHOICES,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
  type ThemeChoice,
  themeInitScript,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import ThemeToggle from '../../Template/ThemeToggle';

const DEVICES = ['light', 'dark'] as const;

const CHROME_COLORS = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
} as const;

function at(choice: ThemeChoice, theme: ResolvedTheme, next: ThemeChoice) {
  return {
    choice,
    theme,
    chrome: CHROME_COLORS[theme],
    stored: choice === 'system' ? null : choice,
    name: `Theme preference: ${choice}. Switch to ${next}.`,
  };
}

/**
 * One lap from `system` on each kind of device, written out so this is the
 * order a visitor meets. The second stop is the first press: its theme differs
 * from the device's, so that press visibly changes the page.
 */
const LAP = {
  light: [
    at('system', 'light', 'dark'),
    at('dark', 'dark', 'light'),
    at('light', 'light', 'system'),
  ],
  dark: [
    at('system', 'dark', 'light'),
    at('light', 'light', 'dark'),
    at('dark', 'dark', 'system'),
  ],
};

type Stop = (typeof LAP.light)[number];

const stopOf = (device: ResolvedTheme, choice: ThemeChoice) =>
  LAP[device].find((stop) => stop.choice === choice) as Stop;

/** Every press of a lap, ending back on `system`. */
const round = (device: ResolvedTheme) => [
  ...LAP[device].slice(1),
  LAP[device][0],
];

const other = (device: ResolvedTheme) => (device === 'dark' ? 'light' : 'dark');

const toggle = () => screen.getByRole('button');

/** Where a press leaves things: asked for, painted, remembered, and named. */
function reading() {
  const root = document.documentElement;

  return {
    choice: root.getAttribute(THEME_CHOICE_ATTRIBUTE),
    theme: root.getAttribute(THEME_ATTRIBUTE),
    chrome: document
      .querySelector(RESOLVED_THEME_COLOR_SELECTOR)
      ?.getAttribute('content'),
    stored: window.localStorage.getItem(THEME_STORAGE_KEY),
    name: toggle().getAttribute('aria-label'),
  };
}

/** Presses once per stop, checking where each press lands. */
function walk(stops: readonly Stop[]) {
  for (const stop of stops) {
    fireEvent.click(toggle());
    expect(reading()).toEqual(stop);
  }
}

/** A `matchMedia` to flip mid-test, or none for a `null` device. */
function stubColorScheme(device: ResolvedTheme | null) {
  const listeners = new Set<() => void>();
  const media = {
    matches: device === 'dark',
    addEventListener: (_: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: () => void) => {
      listeners.delete(listener);
    },
  };

  window.matchMedia = (device && (() => media)) as unknown as typeof matchMedia;

  return {
    flipTo(next: ResolvedTheme) {
      media.matches = next === 'dark';
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

function addStyle(css: string): void {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}

/**
 * A real page on a device: the tokens `data-theme` switches between, and the
 * bootstrap, run rather than imitated because its tag is the one the component
 * then writes to.
 */
function openPage(device: ResolvedTheme | null) {
  const media = stubColorScheme(device);

  addStyle(
    `:root{${THEME_COLOR_TOKEN}:${CHROME_COLORS.light};}` +
      `[${THEME_ATTRIBUTE}='dark']{${THEME_COLOR_TOKEN}:${CHROME_COLORS.dark};}`,
  );
  new Function(themeInitScript(CHROME_COLORS))();

  return media;
}

/** The markup as it arrives: rendered with no device, no React attached yet. */
function serverMarkup() {
  const { matchMedia } = window;
  stubColorScheme(null);

  const host = document.createElement('div');
  host.innerHTML = renderToString(<ThemeToggle />);
  document.body.append(host);
  window.matchMedia = matchMedia;

  const button = host.querySelector('button');
  if (!button) throw new Error('no theme toggle in the server markup');

  return { host, button };
}

/** The tags React hoists for `viewport.themeColor`, as a navigation rebuilds. */
function hoistThemeColorPair(): Element[] {
  return DEVICES.map((scheme) => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('media', `(prefers-color-scheme: ${scheme})`);
    meta.setAttribute('content', CHROME_COLORS[scheme]);
    document.head.append(meta);
    return meta;
  });
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_CHOICE_ATTRIBUTE);
    document.head.replaceChildren();
    document.body.replaceChildren();
  });

  // The server markup, the real stylesheet, the attribute the bootstrap stamps,
  // and no React: what a visitor has between first paint and hydration.
  describe('before hydration', () => {
    function unhydrated(choice: ThemeChoice | null) {
      addStyle(
        readFileSync(
          join(process.cwd(), 'app/styles/layout/navigation.css'),
          'utf8',
        ),
      );
      if (choice !== null) {
        document.documentElement.setAttribute(THEME_CHOICE_ATTRIBUTE, choice);
      }

      const { button } = serverMarkup();
      const visible = [...button.querySelectorAll('[data-theme-state]')]
        .filter((state) => getComputedStyle(state).display !== 'none')
        .map((state) => state.getAttribute('data-theme-state'));

      return { button, visible };
    }

    it.each(THEME_CHOICES)(
      'shows and names one state for choice %s, promising no next step',
      (choice) => {
        const { button, visible } = unhydrated(choice);

        expect(button).toBeVisible();
        expect(visible).toEqual([choice]);
        expect(button).toHaveAccessibleName(`Theme preference: ${choice}.`);
        // The next step depends on a device the server cannot see, and an
        // `aria-label` would override the one name CSS has left visible.
        expect(button.outerHTML).not.toMatch(/switch to|aria-label|title=/i);
      },
    );

    it('hides the inert control when the bootstrap did not run', () => {
      const { button, visible } = unhydrated(null);

      expect(button).not.toBeVisible();
      expect(visible).toEqual([]);
    });
  });

  // No `suppressHydrationWarning` is in play, so a mismatch reaches
  // `console.error`, or `onRecoverableError` when React had to re-render.
  it.each(
    DEVICES.flatMap((device) =>
      THEME_CHOICES.map((choice) => [device, choice] as const),
    ),
  )(
    'on a %s device with %s chosen, hydrating only adds a name to the markup',
    (device, choice) => {
      if (choice !== 'system') {
        window.localStorage.setItem(THEME_STORAGE_KEY, choice);
      }
      openPage(device);
      const { host, button } = serverMarkup();
      const spans = button.innerHTML;
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const recovered = vi.fn();

      act(() => {
        hydrateRoot(host, <ThemeToggle />, { onRecoverableError: recovered });
      });

      expect(recovered).not.toHaveBeenCalled();
      expect(errors).not.toHaveBeenCalled();

      const { name } = stopOf(device, choice);
      expect(toggle()).toHaveAttribute('aria-label', name);
      expect(toggle()).toHaveAttribute('title', name);
      expect(button.innerHTML).toBe(spans);
    },
  );

  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
    // The bootstrap paints light with no device to ask, so light orders the lap.
    [null, 'light'],
  ] as const)(
    'on a %s device, the first press changes the page and three go round',
    (device, order) => {
      openPage(device);
      render(<ThemeToggle />);

      expect(reading()).toEqual(LAP[order][0]);
      walk(round(order));
    },
  );

  it('leaves the bootstrap theme alone when the device cannot be read', () => {
    // Guessing light here is exactly the flash the bootstrap exists to avoid.
    openPage('dark');
    stubColorScheme(null);

    render(<ThemeToggle />);

    expect(reading()).toMatchObject({ choice: 'system', theme: 'dark' });
  });

  // The handler answering such a press is the first render's, where the stored
  // choice and the device are both unread, so it has to ask both itself.
  describe('a press between the commit and the mount effects', () => {
    function press() {
      function PressedOnCommit() {
        useLayoutEffect(() => {
          const button = document.querySelector('button');
          if (!button || button.hasAttribute('aria-label')) {
            throw new Error('expected a toggle that has not mounted yet');
          }

          button.click();
        }, []);

        return <ThemeToggle />;
      }

      render(<PressedOnCommit />);
    }

    it.each(DEVICES)('orders the lap by a %s device', (device) => {
      openPage(device);

      press();

      const [first, ...rest] = round(device);
      expect(reading()).toEqual(first);
      walk(rest);
    });

    it('starts from the stored choice', () => {
      // Dark is the lap's first stop on a light device, so the press goes on to
      // light rather than back to `system`.
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      openPage('light');

      press();

      expect(reading()).toEqual(stopOf('light', 'light'));
    });

    it.each(DEVICES)('holds on a %s device when storage throws', (device) => {
      // Throwing storage reads as `system`, so a mount effect that adopted it
      // after the press would undo the press.
      openPage(device);

      // Reaching into it throws, as blocked site data does.
      vi.stubGlobal('localStorage', null);
      press();
      vi.unstubAllGlobals();

      expect(reading()).toEqual({ ...LAP[device][1], stored: null });
    });
  });

  // A lap finishes in the order it set out in, or a flip makes the next press an
  // avoidable no-op. Only `system`, where a lap starts, asks the device again.
  describe('when the device flips', () => {
    it.each(DEVICES)(
      'on `system` on a %s device, follows it and walks its lap',
      (device) => {
        const media = openPage(device);
        render(<ThemeToggle />);

        media.flipTo(other(device));
        expect(reading()).toEqual(LAP[other(device)][0]);
        walk(round(other(device)));

        // Round to `system` again, so the device is followed again.
        media.flipTo(device);
        expect(reading()).toEqual(LAP[device][0]);
      },
    );

    it.each(
      DEVICES.flatMap((device) =>
        [1, 2].map((presses) => [device, presses] as const),
      ),
    )(
      'on a %s device after %i presses, holds the theme and finishes the lap',
      (device, presses) => {
        const media = openPage(device);
        render(<ThemeToggle />);
        for (let i = 0; i < presses; i += 1) fireEvent.click(toggle());
        const before = reading();

        media.flipTo(other(device));

        expect(reading()).toEqual(before);
        walk(LAP[device].slice(presses + 1));
        walk(LAP[other(device)].slice(0, 2));
      },
    );
  });

  // A client-side navigation destroys and rebuilds every `<meta>` React owns from
  // the build-time payload, with no state change to re-run an effect.
  it('keeps the chrome through a navigation that rebuilds the tags React owns', () => {
    openPage('light');
    const pair = hoistThemeColorPair();
    render(<ThemeToggle />);

    // Dark pinned against a light device, so the rebuilt light tag disagrees.
    fireEvent.click(toggle());

    for (const meta of pair) meta.remove();
    hoistThemeColorPair();

    // The browser paints from the first tag with no `media` or a matching one.
    const [painted, ...others] = document.querySelectorAll(
      THEME_COLOR_META_SELECTOR,
    );
    expect(painted).not.toHaveAttribute('media');
    expect(painted).toHaveAttribute('content', CHROME_COLORS.dark);
    expect(others).toHaveLength(2);
  });
});
