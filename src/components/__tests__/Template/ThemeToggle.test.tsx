import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DARK_SCHEME_QUERY,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from '@/lib/theme';
import ThemeToggle from '../../Template/ThemeToggle';

const SYSTEM_LABEL = 'Theme preference: system. Switch to light.';
const LIGHT_LABEL = 'Theme preference: light. Switch to dark.';
const DARK_LABEL = 'Theme preference: dark. Switch to system.';

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
    // one icon and one truthful name before the client bundle hydrates.
    it.each([
      ['system', SYSTEM_LABEL],
      ['light', LIGHT_LABEL],
      ['dark', DARK_LABEL],
    ])('shows one state and names it for choice %s', (choice, label) => {
      const button = renderUnhydrated(choice);

      expect(button).toBeVisible();
      expect(visibleStates()).toEqual([choice]);
      expect(button).toHaveAccessibleName(label);
    });

    it('hides the inert control when the bootstrap did not run', () => {
      const button = renderUnhydrated(null);

      expect(button).not.toBeVisible();
      expect(visibleStates()).toEqual([]);
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
});
