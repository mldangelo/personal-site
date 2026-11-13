/**
 * Theme vocabulary shared by the pre-paint bootstrap and the toggle.
 *
 * Two attributes live on `<html>`, both stamped before first paint:
 *
 * - `data-theme` is the *resolved* theme, `light` or `dark`. Every stylesheet
 *   keys off this and nothing else.
 * - `data-theme-choice` is what the visitor actually asked for, including
 *   `system`. It exists because `data-theme` cannot tell "dark" from
 *   "following a device that is currently dark", so without it the control
 *   could not render its own state before hydration.
 *
 * The browser chrome follows `data-theme` too, for the same reason every
 * stylesheet does: an explicit choice is allowed to disagree with the device,
 * and the chrome has to be the colour immediately under it. It cannot be
 * styled, so it gets a `theme-color` meta of its own —
 * {@link RESOLVED_THEME_COLOR_ATTRIBUTE}.
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

/** The token the browser chrome is painted with: the page and header background. */
export const THEME_COLOR_TOKEN = '--color-bg-alt';

/** Every `theme-color` meta, whoever created it. */
export const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

/**
 * The mark on the one `theme-color` meta that carries the *rendered* theme.
 *
 * `theme-color` has no `data-theme` selector, so the only lever from script is
 * a tag's `content`. Repointing the tags the page already shipped is the
 * obvious move and it does not hold: React owns those and re-creates them on
 * every client-side navigation, from the build-time payload. Worse, it matches
 * them back up by `content` and `name` but never by `media`, so a repointed tag
 * is claimed by whichever hoisted meta now shares its colour and a third tag is
 * built for the one left unmatched.
 *
 * So the rendered theme gets a tag of its own, created by
 * {@link themeInitScript} before first paint and never rendered by React. It
 * carries no `media`, so it always matches, and it is prepended to `<head>`, so
 * it is first in tree order — the two things that make the browser paint from
 * it. Landing above `<meta charset>` costs nothing: the encoding is settled
 * before any script runs. React cannot revert what it does not own.
 */
const RESOLVED_THEME_COLOR_ATTRIBUTE = 'data-theme-color';

/** The script-owned tag from {@link RESOLVED_THEME_COLOR_ATTRIBUTE}, alone. */
export const RESOLVED_THEME_COLOR_SELECTOR = `${THEME_COLOR_META_SELECTOR}[${RESOLVED_THEME_COLOR_ATTRIBUTE}]`;

/** The chrome colour for each theme, lifted out of the stylesheets at build. */
export type ThemeColors = Readonly<Record<ResolvedTheme, string>>;

/**
 * Every choice, `system` first. This is the order the control's state spans
 * ship in, which static HTML makes the same for every visitor — it is not the
 * order a press walks them in. {@link nextThemeChoice} decides that from the
 * device.
 */
export const THEME_CHOICES: readonly ThemeChoice[] = [
  'system',
  'light',
  'dark',
];

/**
 * The scheme to order the cycle by when the device cannot be asked. Light,
 * because light is what {@link themeInitScript} paints in that case, so the
 * first press still lands on a theme the visitor is not already looking at.
 */
const UNREADABLE_SCHEME: ResolvedTheme = 'light';

/**
 * Where one press of the single control takes the choice.
 *
 * The order depends on the device, because the first press has to change what
 * the visitor is looking at:
 *
 * - light device: `system → dark → light → system`
 * - dark device: `system → light → dark → system`
 *
 * A new visitor is on `system`, and a control whose first press appears to do
 * nothing reads as broken. So the cycle opens on the theme *opposite* the
 * device's, crosses to the other explicit theme, and then hands back to `system`.
 *
 * With three states, `system` always paints the same as one of the explicit
 * themes, so exactly one step in three is necessarily invisible whichever way
 * round the cycle runs. This order puts it last — the explicit theme that
 * matches the device, returning to `system` — after the visitor has twice
 * seen the control work, and the icon changing is the feedback for it.
 *
 * `system` is a real, reachable state, not just the pre-first-click default,
 * so a visitor who picks a theme always has a route back to following the
 * device.
 *
 * `systemScheme` is whichever reading of the device the caller orders by —
 * `ThemeToggle` holds on to the one a lap set out under, so a flip part-way
 * round cannot reorder it — and `null` when the device cannot be asked. The
 * cycle then runs as {@link UNREADABLE_SCHEME} orders it rather than refusing
 * to move.
 */
export function nextThemeChoice(
  choice: ThemeChoice,
  systemScheme: ResolvedTheme | null,
): ThemeChoice {
  const device = systemScheme ?? UNREADABLE_SCHEME;
  const opposite: ResolvedTheme = device === 'dark' ? 'light' : 'dark';

  if (choice === 'system') return opposite;

  return choice === opposite ? device : 'system';
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
 * The device's colour scheme, asked once, right now — or `null` when there is
 * no `matchMedia` to ask.
 *
 * Render from `usePrefersColorScheme` instead: it subscribes, which is what
 * keeps `system` live. This is for the two moments `ThemeToggle` needs the
 * device before that hook has reported: on mounting, and in a press that
 * lands earlier still. A press can be dispatched between hydration and the
 * mount effects, to the hydration render's handler, where the hook still says
 * `null` — and ordering the cycle by a guess there brings the no-op first
 * press back for whichever device the guess is wrong about.
 */
export function readSystemScheme(): ResolvedTheme | null {
  const media = window.matchMedia?.(DARK_SCHEME_QUERY);
  if (!media) return null;

  return media.matches ? 'dark' : 'light';
}

/**
 * Bring the browser chrome back in step with `<html data-theme>`.
 *
 * Call after `data-theme` settles, on every change: the attribute is what the
 * visitor chose, and the device preference the meta tags are scoped by is not.
 *
 * The colour is the computed token rather than a hex handed to the client: the
 * cascade has already answered this question, so the chrome cannot disagree
 * with what is on screen the way a second copy of the palette could. It is
 * written to the tag {@link themeInitScript} created, and no tag is added. An
 * unresolved token leaves that tag as it is, because an empty `content` is
 * skipped by the browser and would drop the page back to default chrome.
 */
export function syncThemeColor(doc: Document): void {
  const meta = doc.head.querySelector(RESOLVED_THEME_COLOR_SELECTOR);
  const color = doc.defaultView
    ?.getComputedStyle(doc.documentElement)
    .getPropertyValue(THEME_COLOR_TOKEN)
    .trim();

  if (meta && color) meta.setAttribute('content', color);
}

/**
 * The inline `<head>` script that stamps both attributes before first paint.
 *
 * Built from the constants above so the bootstrap and the React control share
 * one vocabulary. Their storage parsing is necessarily duplicated inside the
 * generated script, so an agreement test guards it against drift. Each
 * `window` access is guarded separately, so a `localStorage` that throws cannot
 * leave a page with no `data-theme` at all.
 *
 * It also adds the chrome colour's tag, in the same pass and from the same
 * resolved theme, because a returning visitor whose stored choice contradicts
 * their device would otherwise read the whole first paint with the address bar
 * painted from a device preference nothing else here follows. This is the only
 * place that tag is created; {@link syncThemeColor} writes to it afterwards,
 * which `theme.test.ts` checks by running this script and then calling that
 * function. The colours are passed in rather
 * than read here: they come from `readColorToken`, which reads the filesystem
 * and must not reach the client bundle. They are embedded through
 * `JSON.stringify` so a value can never break out of the string literal.
 */
export function themeInitScript(colors: ThemeColors): string {
  const light = JSON.stringify(colors.light);
  const dark = JSON.stringify(colors.dark);

  return `(function(){var c='system';try{var s=window.localStorage.getItem('${THEME_STORAGE_KEY}');if(s==='light'||s==='dark'){c=s}}catch(e){}var r=document.documentElement;r.setAttribute('${THEME_CHOICE_ATTRIBUTE}',c);var t=c;if(c==='system'){t='light';try{if(window.matchMedia('${DARK_SCHEME_QUERY}').matches){t='dark'}}catch(e){}}r.setAttribute('${THEME_ATTRIBUTE}',t);var m=document.createElement('meta');m.setAttribute('name','theme-color');m.setAttribute('${RESOLVED_THEME_COLOR_ATTRIBUTE}','');m.setAttribute('content',t==='dark'?${dark}:${light});document.head.prepend(m)})();`;
}
