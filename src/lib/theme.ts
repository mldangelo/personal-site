/**
 * Theme vocabulary shared by the pre-paint bootstrap and the toggle.
 *
 * Two attributes live on `<html>`, both stamped before first paint:
 *
 * - `data-theme` is the *resolved* theme, `light` or `dark`. Every stylesheet
 *   keys off this and nothing else.
 * - `data-theme-choice` is what the visitor actually asked for, including
 *   `system`. It exists because `data-theme` cannot tell "dark" from
 *   "following a device that is currently dark", so the control has no way to
 *   render its own state — which is what forced it to wait for hydration and
 *   leave a 44x44 hole in the header.
 *
 * The functions that touch `window` are browser-only by design; the module has
 * no `'use client'` marker so `app/layout.tsx` can build the bootstrap script
 * from the same constants the client uses.
 */

/** A theme the stylesheets can actually paint. */
export type ResolvedTheme = 'light' | 'dark';

/** What the visitor asked for. `system` defers to the device, live. */
export type ThemeChoice = ResolvedTheme | 'system';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_CHOICE_ATTRIBUTE = 'data-theme-choice';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * The order the single control cycles through. `system` is a real, reachable
 * state, not just the pre-first-click default: before this existed the first
 * click pinned a theme in `localStorage` forever with no route back to
 * following the device.
 */
const NEXT_CHOICE: Record<ThemeChoice, ThemeChoice> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

/** Every choice, in cycle order starting from `system`. */
export const THEME_CHOICES: readonly ThemeChoice[] = [
  'system',
  'light',
  'dark',
];

export function nextThemeChoice(choice: ThemeChoice): ThemeChoice {
  return NEXT_CHOICE[choice];
}

/**
 * The theme to paint for a choice, or `null` when it depends on a device
 * preference that has not been read yet. `null` means "leave `data-theme`
 * alone" — the bootstrap already put the right value there, and guessing
 * `light` in the meantime is what would flash a dark-mode visitor.
 */
export function resolveTheme(
  choice: ThemeChoice,
  systemScheme: ResolvedTheme | null,
): ResolvedTheme | null {
  return choice === 'system' ? systemScheme : choice;
}

/**
 * The stored choice, or `system` when nothing is stored.
 *
 * `system` is deliberately represented by the *absence* of the key: a visitor
 * who has never chosen and one who has chosen to follow their device want the
 * same thing. Mirrors the parsing in {@link themeInitScript} — the round trip
 * is pinned by a test.
 */
export function readStoredThemeChoice(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // Storage can throw outright (Safari private browsing, blocked cookies).
    return 'system';
  }
}

export function storeThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // A visitor with no writable storage still gets the theme for this page.
  }
}

/**
 * The inline `<head>` script that stamps both attributes before first paint.
 *
 * Built from the constants above so the bootstrap and the React control share
 * one vocabulary. Their storage parsing is necessarily duplicated inside the
 * generated script, so an agreement test guards it against drift. Each
 * `window` access is guarded separately: a `localStorage` that throws used to
 * abort the whole function and ship a page with no `data-theme` at all.
 */
export function themeInitScript(): string {
  return `(function(){var c='system';try{var s=window.localStorage.getItem('${THEME_STORAGE_KEY}');if(s==='light'||s==='dark'){c=s}}catch(e){}var r=document.documentElement;r.setAttribute('${THEME_CHOICE_ATTRIBUTE}',c);var t=c;if(c==='system'){t='light';try{if(window.matchMedia('${DARK_SCHEME_QUERY}').matches){t='dark'}}catch(e){}}r.setAttribute('${THEME_ATTRIBUTE}',t)})();`;
}
