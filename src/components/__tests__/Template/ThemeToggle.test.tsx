import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useLayoutEffect } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
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

/**
 * The name each state ships with in the static HTML. It says which preference
 * is active and stops there: where a press goes depends on the device, which
 * the HTML cannot know.
 */
const STATE_LABEL = {
  system: 'Theme preference: system.',
  light: 'Theme preference: light.',
  dark: 'Theme preference: dark.',
} as const;

/**
 * The name once mounted, when the device has been read and the next step can
 * be promised. The cycle opens on the theme the device is *not* showing, so
 * the two kinds of device read the three states out differently.
 */
const LABEL = {
  light: {
    system: 'Theme preference: system. Switch to dark.',
    dark: 'Theme preference: dark. Switch to light.',
    light: 'Theme preference: light. Switch to system.',
  },
  dark: {
    system: 'Theme preference: system. Switch to light.',
    light: 'Theme preference: light. Switch to dark.',
    dark: 'Theme preference: dark. Switch to system.',
  },
} as const;

type Device = keyof typeof LABEL;

const DEVICES = ['light', 'dark'] as const;

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

/** A browser with no `matchMedia`, and the server, which has no device. */
function withoutMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: undefined,
  });
}

function other(device: Device): Device {
  return device === 'dark' ? 'light' : 'dark';
}

/**
 * The control, pressed from a layout effect: after React has committed it and
 * before any passive effect — the component's mount effects included — has
 * run.
 */
function PressedOnCommit() {
  useLayoutEffect(() => {
    const button = document.querySelector<HTMLButtonElement>(
      'button.theme-toggle',
    );
    if (!button || button.hasAttribute('aria-label')) {
      throw new Error('expected a theme toggle that has not mounted yet');
    }

    button.click();
  }, []);

  return <ThemeToggle />;
}

/** A storage that rejects every access, as blocked site data does. */
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

/** Where a press left things: what was asked for, painted, and remembered. */
function reading() {
  return {
    choice: root().getAttribute(THEME_CHOICE_ATTRIBUTE),
    theme: root().getAttribute(THEME_ATTRIBUTE),
    stored: window.localStorage.getItem(THEME_STORAGE_KEY),
  };
}

/**
 * One lap from `system` on each kind of device, start and finish included.
 * Written out rather than derived, so the order here is the order a visitor
 * meets and not a second copy of the function that produces it.
 */
const LAP = {
  light: [
    { choice: 'system', theme: 'light', stored: null },
    { choice: 'dark', theme: 'dark', stored: 'dark' },
    { choice: 'light', theme: 'light', stored: 'light' },
    { choice: 'system', theme: 'light', stored: null },
  ],
  dark: [
    { choice: 'system', theme: 'dark', stored: null },
    { choice: 'light', theme: 'light', stored: 'light' },
    { choice: 'dark', theme: 'dark', stored: 'dark' },
    { choice: 'system', theme: 'dark', stored: null },
  ],
} as const;

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

const hydrated: Root[] = [];

/**
 * The markup the server sends, mounted as it arrives: no device to ask while
 * rendering it, and no React attached yet.
 */
function serverMarkup(): { host: HTMLElement; sent: string } {
  withoutMatchMedia();

  const host = document.createElement('div');
  host.innerHTML = renderToString(<ThemeToggle />);
  document.body.appendChild(host);
  unhydrated.push(host);

  return { host, sent: host.innerHTML };
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
    // Roots hydrated by hand are not Testing Library's to unmount.
    act(() => {
      for (const mounted of hydrated.splice(0)) mounted.unmount();
    });
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

      expect(html).toContain(STATE_LABEL.system);
      expect(html).toContain(STATE_LABEL.light);
      expect(html).toContain(STATE_LABEL.dark);
    });

    it('promises no next step, which depends on a device it cannot see', () => {
      // Each state used to ship "Switch to …" too. The cycle now opens on the
      // theme opposite the device's, so that sentence would be read out wrong
      // on one kind of device or the other until the page hydrated.
      const html = renderToStaticMarkup(<ThemeToggle />);

      expect(html).not.toMatch(/switch to/i);
      // And no one name over the top of the three, which is what `aria-label`
      // would be: it wins over the content CSS has picked.
      expect(html).not.toContain('aria-label=');
      expect(html).not.toContain('title=');
    });
  });

  describe('before hydration', () => {
    // The server markup plus the real stylesheet plus the attribute the head
    // bootstrap stamps — no React. This is the whole claim of the component:
    // one icon and one truthful name before the client bundle hydrates.
    it.each(['system', 'light', 'dark'] as const)(
      'shows one state and names it for choice %s',
      (choice) => {
        const button = renderUnhydrated(choice);

        expect(button).toBeVisible();
        expect(visibleStates()).toEqual([choice]);
        expect(button).toHaveAccessibleName(STATE_LABEL[choice]);
      },
    );

    it('hides the inert control when the bootstrap did not run', () => {
      const button = renderUnhydrated(null);

      expect(button).not.toBeVisible();
      expect(visibleStates()).toEqual([]);
    });
  });

  describe('hydration', () => {
    const cases = DEVICES.flatMap((device) =>
      (['system', 'light', 'dark'] as const).map(
        (choice) => [device, choice] as const,
      ),
    );

    // `suppressHydrationWarning` is not in play, so a hydration render that
    // differed from the server's is reported — to `console.error`, and to
    // `onRecoverableError` when React had to re-render to recover. What
    // mounting may do is add one name and one tooltip to the button, and
    // nothing else: the three state spans stay exactly as they were sent.
    it.each(cases)(
      'on a %s device with %s chosen, only adds a name to what the server sent',
      (device, choice) => {
        const { host, sent } = serverMarkup();
        const said = host.querySelector(
          `[data-theme-state="${choice}"] .sr-only`,
        )?.textContent;
        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        const recovered = vi.fn();

        stubColorScheme(device === 'dark');
        if (choice !== 'system') {
          window.localStorage.setItem(THEME_STORAGE_KEY, choice);
        }

        try {
          act(() => {
            hydrated.push(
              hydrateRoot(host, <ThemeToggle />, {
                onRecoverableError: recovered,
              }),
            );
          });

          expect(recovered).not.toHaveBeenCalled();
          expect(errors).not.toHaveBeenCalled();
        } finally {
          errors.mockRestore();
        }

        const label = LABEL[device][choice];
        expect(toggle()).toHaveAttribute('aria-label', label);
        expect(toggle()).toHaveAttribute('title', label);

        // The name it adds opens with the one already read out, so a screen
        // reader user who heard the first is never told it was wrong.
        expect(said).toBe(STATE_LABEL[choice]);
        expect(label.slice(0, said?.length)).toBe(said);

        const unnamed = host.cloneNode(true) as HTMLElement;
        unnamed.querySelector('button')?.removeAttribute('aria-label');
        unnamed.querySelector('button')?.removeAttribute('title');
        expect(unnamed.innerHTML).toBe(sent);
      },
    );
  });

  describe('cycling', () => {
    it.each(DEVICES)(
      'goes round a %s device in three presses, naming every step',
      (device) => {
        stubColorScheme(device === 'dark');
        render(<ThemeToggle />);
        const [start, ...presses] = LAP[device];

        expect(reading()).toEqual(start);
        expect(toggle()).toHaveAccessibleName(LABEL[device][start.choice]);

        for (const stop of presses) {
          fireEvent.click(toggle());

          expect(reading()).toEqual(stop);
          expect(toggle()).toHaveAccessibleName(LABEL[device][stop.choice]);
          expect(toggle()).toHaveAttribute('title', LABEL[device][stop.choice]);
        }
      },
    );

    it('starts from the stored choice rather than from scratch', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      render(<ThemeToggle />);

      fireEvent.click(toggle());

      expect(toggle()).toHaveAccessibleName(LABEL.dark.system);
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    });

    it('orders a returning visitor by the device they came back on', () => {
      // Dark is stored on both devices; what follows it is not the same. On a
      // dark device it is the last stop and hands back to `system`, as above.
      // On a light one it is the first, and light is still to come.
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      stubColorScheme(false);
      render(<ThemeToggle />);
      expect(toggle()).toHaveAccessibleName(LABEL.light.dark);

      fireEvent.click(toggle());

      expect(reading()).toEqual({
        choice: 'light',
        theme: 'light',
        stored: 'light',
      });
    });

    it('still goes round when the device cannot be asked', () => {
      // No `matchMedia`. The bootstrap paints light then, so the control
      // orders itself as a light device would and the first press shows.
      withoutMatchMedia();
      renderHead();
      render(<ThemeToggle />);

      expect(reading()).toEqual({
        choice: 'system',
        theme: 'light',
        stored: null,
      });
      expect(toggle()).toHaveAccessibleName(LABEL.light.system);

      for (const stop of LAP.light.slice(1)) {
        fireEvent.click(toggle());

        expect(reading()).toEqual(stop);
        expect(toggle()).toHaveAccessibleName(LABEL.light[stop.choice]);
      }
    });
  });

  describe('a press that beats the mount effects', () => {
    // The handler that answers such a press is the first render's, where the
    // stored choice and the device are both still unread. Ordering the cycle
    // by the fallback there hands a dark device the no-op first press, so the
    // handler asks both directly. There are two ways in, and they differ in
    // which runs first afterwards: the press's own update or the mount
    // effects'.

    /**
     * In the same breath as `hydrateRoot`, before React has hydrated the
     * control at all: it hydrates in order to dispatch the press.
     */
    function pressWhileHydrating(device: Device): void {
      const { host } = serverMarkup();
      const button = host.querySelector<HTMLButtonElement>('button');
      if (!button) throw new Error('no theme toggle in the server markup');

      stubColorScheme(device === 'dark');
      act(() => {
        hydrated.push(hydrateRoot(host, <ThemeToggle />));
        // The evidence that this is the early press: the name mounting adds
        // is not there yet.
        expect(button).not.toHaveAttribute('aria-label');
        button.click();
      });
    }

    /**
     * After React has committed the control and before any passive effect has
     * run, so the mount effects come *after* the press. This is the gap a
     * browser's earliest press lands in: pressing as early as Chromium would
     * deliver one against the export reached the handler there every time.
     */
    function pressBeforeMountEffects(device: Device): void {
      stubColorScheme(device === 'dark');
      render(<PressedOnCommit />);
    }

    describe.each([
      ['before React has hydrated the control', pressWhileHydrating],
      ['between the commit and the mount effects', pressBeforeMountEffects],
    ] as const)('%s', (_when, press) => {
      it.each(DEVICES)(
        'completes the cycle after an early press on %s',
        (device) => {
          root().setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
          root().setAttribute(THEME_ATTRIBUTE, device);
          press(device);

          for (const [index, stop] of LAP[device].slice(1).entries()) {
            if (index > 0) fireEvent.click(toggle());
            expect(reading()).toEqual(stop);
            expect(toggle()).toHaveAccessibleName(LABEL[device][stop.choice]);
          }
        },
      );

      it('starts from the stored choice, read at the press', () => {
        // Dark stored, light device: dark is the lap's first stop there, so
        // the press goes on to light rather than back to `system`.
        window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        root().setAttribute(THEME_CHOICE_ATTRIBUTE, 'dark');
        root().setAttribute(THEME_ATTRIBUTE, 'dark');

        press('light');

        expect(reading()).toEqual({
          choice: 'light',
          theme: 'light',
          stored: 'light',
        });
      });

      it.each(DEVICES)('holds on a %s device when storage throws', (device) => {
        // Site data blocked: nothing can be written and nothing read back,
        // so storage reads as `system`. A mount effect that runs after the
        // press and adopts that reading undoes the press — measured against
        // the export, the first press of the visit then did nothing at all.
        root().setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
        root().setAttribute(THEME_ATTRIBUTE, device);

        withThrowingStorage(() => press(device));

        expect(reading()).toEqual({
          choice: other(device),
          theme: other(device),
          stored: null,
        });
        expect(toggle()).toHaveAccessibleName(LABEL[device][other(device)]);
      });
    });
  });

  describe('when the device flips part-way round', () => {
    // The cycle takes its order from the device, so a flip between two
    // presses could reorder the lap under a visitor who is half-way through
    // it. A lap finishes in the order it set out in instead: only `system`,
    // where the next lap starts, asks the device again.
    it.each(DEVICES)(
      'walks the lap of the flipped device if a %s device flips before the first press',
      (device) => {
        // Nothing is part-way round yet, so the whole lap belongs to the
        // device as it is at the press that starts it — not to the one the
        // page happened to mount under, which would leave the flipped
        // device's own theme with no press that reaches it.
        const media = stubColorScheme(device === 'dark');
        render(<ThemeToggle />);
        const flipped = other(device);
        const [start, ...presses] = LAP[flipped];

        media.flipTo(flipped === 'dark');
        expect(reading()).toEqual(start);

        for (const stop of presses) {
          fireEvent.click(toggle());

          expect(reading()).toEqual(stop);
          expect(toggle()).toHaveAccessibleName(LABEL[flipped][stop.choice]);
        }
      },
    );

    it.each(
      DEVICES.flatMap((device) =>
        [1, 2].map((presses) => [device, presses] as const),
      ),
    )(
      'holds the order when a %s device flips after %i presses, then starts a new cycle',
      (device, presses) => {
        const media = stubColorScheme(device === 'dark');
        render(<ThemeToggle />);
        for (let i = 0; i < presses; i += 1) fireEvent.click(toggle());
        const before = reading();
        const label = toggle().getAttribute('aria-label') ?? '';

        const flipped = other(device);
        media.flipTo(flipped === 'dark');
        expect(reading()).toEqual(before);
        expect(toggle()).toHaveAccessibleName(label);

        for (const stop of LAP[device].slice(presses + 1, 3)) {
          fireEvent.click(toggle());
          expect(reading()).toEqual(stop);
          expect(toggle()).toHaveAccessibleName(LABEL[device][stop.choice]);
        }
        fireEvent.click(toggle());
        expect(reading()).toEqual(LAP[flipped][0]);
        expect(toggle()).toHaveAccessibleName(LABEL[flipped].system);
        fireEvent.click(toggle());
        expect(reading()).toEqual(LAP[flipped][1]);
      },
    );

    it.each(
      DEVICES.flatMap((device) =>
        DEVICES.map((stored) => [device, stored] as const),
      ),
    )(
      'keeps the promised step for saved %s-device preference %s when the device flips',
      (device, stored) => {
        window.localStorage.setItem(THEME_STORAGE_KEY, stored);
        const media = stubColorScheme(device === 'dark');
        render(<ThemeToggle />);
        expect(toggle()).toHaveAccessibleName(LABEL[device][stored]);
        media.flipTo(device !== 'dark');
        expect(toggle()).toHaveAccessibleName(LABEL[device][stored]);
        fireEvent.click(toggle());
        expect(reading()).toEqual(
          stored === device
            ? { choice: 'system', theme: other(device), stored: null }
            : { choice: device, theme: device, stored: device },
        );
      },
    );
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

      // Round to explicit light, which a light device paints exactly as it
      // paints `system` — only the device flipping can tell the two apart.
      fireEvent.click(toggle());
      fireEvent.click(toggle());
      expect(reading()).toEqual({
        choice: 'light',
        theme: 'light',
        stored: 'light',
      });

      media.flipTo(true);

      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('light');
    });

    it('re-adopts the device when cycled back to system', () => {
      const media = stubColorScheme(false);
      render(<ThemeToggle />);

      // Pin dark, then light, then hand control back.
      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_ATTRIBUTE)).toBe('dark');

      fireEvent.click(toggle());
      fireEvent.click(toggle());
      expect(root().getAttribute(THEME_CHOICE_ATTRIBUTE)).toBe('system');
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

      // system -> dark, pinned against a light device.
      fireEvent.click(toggle());
      expect(paintedChromeColor(false)).toBe(CHROME_COLORS.dark);

      // dark -> light -> system.
      fireEvent.click(toggle());
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

      // system -> dark: dark pinned on a light-preferring device, which is the
      // direction that broke.
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
