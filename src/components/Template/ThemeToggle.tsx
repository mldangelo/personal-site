'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/Icons';
import usePrefersColorScheme from '@/hooks/usePrefersColorScheme';
import {
  nextThemeChoice,
  readStoredThemeChoice,
  resolveTheme,
  storeThemeChoice,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_CHOICES,
  type ThemeChoice,
} from '@/lib/theme';

/**
 * A display, for the state that follows whatever the display is set to.
 * Local because nothing outside this control needs it; same Feather geometry
 * and stroke as the sun and moon it sits beside.
 */
function SystemIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const ICONS: Record<ThemeChoice, ReactNode> = {
  system: <SystemIcon />,
  light: <SunIcon />,
  dark: <MoonIcon />,
};

/**
 * Current state first, then what a press does.
 *
 * `aria-pressed` cannot express three states, and a name that only says
 * "switch to dark mode" leaves a screen reader user unable to tell which of
 * the three is active. The next state is derived from `nextThemeChoice` so the
 * label cannot disagree with the cycle it describes.
 */
function labelFor(choice: ThemeChoice): string {
  return `Theme: ${choice}. Switch to ${nextThemeChoice(choice)}.`;
}

/**
 * Cycles system → light → dark → system, where `system` follows the device live.
 *
 * That order is `nextThemeChoice`'s, not a copy of it: both the labels and the
 * rendered states below come out of `src/lib/theme.ts`, so this control cannot
 * end up describing an order it does not perform. `system` is the state a
 * visitor who has never chosen starts in, and the one they can get back to.
 *
 * The rendered markup is deliberately identical for all three states: every
 * state is present, and CSS shows the one matching `data-theme-choice` on
 * `<html>`, which the `<head>` bootstrap resolves before first paint. That is
 * what lets a real button ship in the static HTML — the previous version could
 * not know the theme until it mounted, so it reserved a blank 44x44 hole in
 * the header and swapped a button in on hydration.
 */
export default function ThemeToggle() {
  const systemScheme = usePrefersColorScheme();
  // `null` until mounted, which keeps the hydration render byte-identical to
  // the server render. It is not used to decide what to draw.
  const [choice, setChoice] = useState<ThemeChoice | null>(null);

  useEffect(() => {
    setChoice(readStoredThemeChoice());
  }, []);

  useEffect(() => {
    if (choice === null) return;

    const root = document.documentElement;
    root.setAttribute(THEME_CHOICE_ATTRIBUTE, choice);

    // `null` while the device preference is still unknown: the bootstrap
    // already put the right value on `data-theme`, so leave it be rather than
    // flash a guess. Re-runs when the device flips, which is how `system`
    // stays live instead of being a one-shot sample at mount.
    const resolved = resolveTheme(choice, systemScheme);
    if (resolved !== null) {
      root.setAttribute(THEME_ATTRIBUTE, resolved);
    }

    // The browser chrome is painted from `theme-color` meta tags, which the
    // export scopes by `prefers-color-scheme` because that is all a static
    // file can do. Nothing else here themes off the device, so once the
    // attribute above is settled the tags have to be told what it says —
    // including when the device flips underneath a `system` choice, which is
    // the other reason this runs on every change rather than once at mount.
    // Reads the token back out of the cascade, so it cannot name a colour the
    // page is not painted with.
    syncThemeColor(document);
  }, [choice, systemScheme]);

  const cycle = useCallback(() => {
    const next = nextThemeChoice(choice ?? readStoredThemeChoice());
    storeThemeChoice(next);
    setChoice(next);
  }, [choice]);

  // Before mount the accessible name comes from the one state label CSS leaves
  // visible; after mount this states it outright, for both the name and the
  // pointer tooltip.
  const label = choice === null ? undefined : labelFor(choice);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={label}
      title={label}
    >
      {THEME_CHOICES.map((state) => (
        <span
          key={state}
          className="theme-toggle-state"
          data-theme-state={state}
        >
          {ICONS[state]}
          <span className="sr-only">{labelFor(state)}</span>
        </span>
      ))}
    </button>
  );
}
