import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DARK_SCHEME_QUERY,
  RESOLVED_THEME_COLOR_SELECTOR,
  THEME_ATTRIBUTE,
  THEME_COLOR_META_SELECTOR,
  THEME_COLOR_TOKEN,
  THEME_STORAGE_KEY,
} from '@/lib/theme-color';
import { readColorToken } from '@/lib/tokens';
import ThemeToggle from '../../Template/ThemeToggle';

const COLORS = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
} as const;

const injected: Element[] = [];

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
    flipTo(prefersDark: boolean) {
      matches = prefersDark;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

function addTokenStyles(): void {
  const style = document.createElement('style');
  style.textContent =
    `:root{${THEME_COLOR_TOKEN}:${COLORS.light};}` +
    `[${THEME_ATTRIBUTE}='dark']{${THEME_COLOR_TOKEN}:${COLORS.dark};}`;
  document.head.append(style);
  injected.push(style);
}

function chromeColor(): string | null {
  return (
    document
      .querySelector(RESOLVED_THEME_COLOR_SELECTOR)
      ?.getAttribute('content') ?? null
  );
}

function button(): HTMLElement {
  return screen.getByRole('button');
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    addTokenStyles();
    stubColorScheme(false);
  });

  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    for (const node of injected.splice(0)) node.remove();
    for (const node of document.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
      node.remove();
    }
  });

  it('renders a labelled theme control after mounting', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(button()).toHaveClass('theme-toggle');
      expect(button()).toHaveAccessibleName('Switch to dark mode');
    });
  });

  it('follows system changes live while no choice is stored', async () => {
    const system = stubColorScheme(false);
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(
        THEME_ATTRIBUTE,
        'light',
      );
      expect(chromeColor()).toBe(COLORS.light);
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();

    system.flipTo(true);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
      expect(chromeColor()).toBe(COLORS.dark);
      expect(button()).toHaveAccessibleName('Switch to light mode');
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('keeps an explicit choice when the device changes', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const system = stubColorScheme(false);
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(
        THEME_ATTRIBUTE,
        'light',
      );
    });

    system.flipTo(true);

    expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, 'light');
    expect(chromeColor()).toBe(COLORS.light);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('updates the page, browser chrome, and storage on a manual toggle', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(button()).toHaveAccessibleName('Switch to dark mode');
    });
    fireEvent.click(button());

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
      expect(chromeColor()).toBe(COLORS.dark);
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });
  });

  it('leaves the resolved chrome tag ahead of metadata added on navigation', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(chromeColor()).toBe(COLORS.light);
    });
    fireEvent.click(button());
    await waitFor(() => {
      expect(chromeColor()).toBe(COLORS.dark);
    });

    const routeMeta = document.createElement('meta');
    routeMeta.setAttribute('name', 'theme-color');
    routeMeta.setAttribute('content', COLORS.light);
    document.head.append(routeMeta);
    injected.push(routeMeta);

    const first = document.querySelector(THEME_COLOR_META_SELECTOR);
    expect(first?.matches(RESOLVED_THEME_COLOR_SELECTOR)).toBe(true);
    expect(first).toHaveAttribute('content', COLORS.dark);
  });
});
