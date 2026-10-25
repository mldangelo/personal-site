'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/Icons';
import usePrefersColorScheme from '@/hooks/usePrefersColorScheme';
import {
  nextThemeChoice,
  type ResolvedTheme,
  readStoredThemeChoice,
  readSystemScheme,
  resolveTheme,
  storeThemeChoice,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_CHOICE_ATTRIBUTE,
  THEME_CHOICES,
  type ThemeChoice,
} from '@/lib/theme';

/**
 * A monitor icon for the state that follows the device's color-scheme
 * preference.
 *
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
 * The name each state ships with in the static HTML: which preference is
 * active, and nothing about what a press does.
 *
 * It used to end "Switch to …" as well. The next state now depends on the
 * device's colour scheme, which static HTML cannot know, so a promise baked in
 * here would be wrong on one kind of device or the other — "Switch to light"
 * read out on the light device whose first press goes dark. A name that says
 * less is still true.
 */
function stateLabel(choice: ThemeChoice): string {
  return `Theme preference: ${choice}.`;
}

/**
 * Current state first, then what a press does.
 *
 * `aria-pressed` cannot express three states, and a name that only says
 * "switch to dark mode" leaves a screen reader user unable to tell which of
 * the three is active. `next` is the value the press itself acts on, so the
 * label cannot disagree with the cycle it describes.
 */
function labelFor(choice: ThemeChoice, next: ThemeChoice): string {
  return `${stateLabel(choice)} Switch to ${next}.`;
}

/**
 * A three-state theme control, including `system`, which follows the device
 * live rather than sampling its preference once.
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
  // The device scheme the lap in progress is walked under: read on mounting,
  // and again by every press that leaves `system`. It is held rather than
  // asked for at each press because `nextThemeChoice` takes its order from
  // the device, so a flip would reorder the lap under a visitor who is
  // part-way round it: dark, pressed for on a light device, becomes the last
  // stop the moment the device goes dark, and the next press hands back to
  // `system`, paints dark again, and changes nothing while light has still
  // not been offered.
  const [lapScheme, setLapScheme] = useState<ResolvedTheme | null>(null);

  useEffect(() => {
    // A press can get here first (see `cycle`), and its choice is the newer
    // one. Storage normally hands the same value straight back, but storage
    // that throws reads as `system`, and adopting that undid the press: the
    // control's first press did nothing at all for a visitor with site data
    // blocked.
    setChoice((pressed) => pressed ?? readStoredThemeChoice());
    // A visitor who arrives on an explicit choice is part-way round already.
    setLapScheme(readSystemScheme());
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

    // The browser chrome is painted from a `theme-color` meta, which cannot be
    // styled, so once the attribute above is settled the tag has to be told
    // what it says — including when the device flips underneath a `system`
    // choice, which is the other reason this runs on every change rather than
    // once at mount. Reads the token back out of the cascade, so it cannot
    // name a colour the page is not painted with.
    //
    // The pathname is deliberately *not* a dependency. It used to need to be,
    // because this repointed the tags Next rendered and React rebuilt those on
    // every client-side navigation, reverting the mutation. It now writes to a
    // tag the bootstrap created, which React never owns and no navigation can
    // touch — so the mutation survives without this effect having to chase it.
    syncThemeColor(document);
  }, [choice, systemScheme]);

  // What orders the next press. Only `system` asks the device afresh: that is
  // where a lap starts, and where its first press has to be the visible one.
  const orderScheme = choice === 'system' ? systemScheme : lapScheme;

  // Where a press goes from here, once mounted. The label and the press both
  // take this one value, so the name cannot promise a step the press skips.
  const next = choice === null ? null : nextThemeChoice(choice, orderScheme);

  const cycle = useCallback(() => {
    // `next` is `null` when the press beat the mount effects: the handler is
    // still the hydration render's, where neither the stored choice nor the
    // device has been read. Measured against the export, every press made as
    // early as Chromium would deliver one landed in that gap. Ask both
    // directly rather than order the cycle by a guess, which would hand a dark
    // device the no-op first press.
    const scheme = next === null ? readSystemScheme() : orderScheme;
    const to = next ?? nextThemeChoice(readStoredThemeChoice(), scheme);

    storeThemeChoice(to);
    setChoice(to);
    setLapScheme(scheme);
  }, [next, orderScheme]);

  // Before mount the accessible name comes from the one state label CSS leaves
  // visible, which says only what the preference is. After mount this adds
  // what a press does, for both the name and the pointer tooltip.
  const label =
    choice === null || next === null ? undefined : labelFor(choice, next);

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
          <span className="sr-only">{stateLabel(state)}</span>
        </span>
      ))}
    </button>
  );
}
