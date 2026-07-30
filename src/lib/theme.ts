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
 * The `theme-color` meta tags follow `data-theme` too, for the same reason
 * every stylesheet does: an explicit choice is allowed to disagree with the
 * device, and the browser chrome has to be the colour immediately under it.
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
 * The token whose value the browser chrome is painted with: the page
 * background the sticky header tints, not the raised surface.
 */
export const THEME_COLOR_TOKEN = '--color-bg-alt';

/**
 * Every `theme-color` meta, not the one that happens to match the device.
 *
 * `theme-color` has no `data-theme` selector, so the only lever from script is
 * the `content` of the tags themselves. The static export ships the
 * media-scoped pair from `app/layout.tsx` — that is the answer for a visitor
 * with no JavaScript, and the only correct one available without it. Once
 * script runs, the device preference stops being the question, so every tag is
 * pointed at the rendered theme and it no longer matters which one the browser
 * picks.
 */
export const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

/** The chrome colour for each theme, lifted out of the stylesheets at build. */
export type ThemeColors = Readonly<Record<ResolvedTheme, string>>;

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

/**
 * Every choice, in cycle order, opening on the `system` a visitor who has never
 * chosen is already in.
 *
 * The one place the order is written down: `ThemeToggle` iterates this and
 * labels each state through {@link nextThemeChoice} rather than restating the
 * sequence in prose, which is what its docstring used to do. This is still a
 * second literal beside {@link NEXT_CHOICE}, so `theme.test.ts` walks
 * `nextThemeChoice` from the un-chosen state and asserts the walk reproduces
 * this array — reordering one and not the other is otherwise invisible, and
 * was: the whole suite stayed green with this array reversed.
 */
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
 * Point every `theme-color` meta at one colour.
 *
 * An empty colour is a no-op rather than an empty `content`: a tag with no
 * usable value is skipped by the browser, which would drop back to its own
 * default chrome instead of to the media-scoped value that is already there.
 */
export function applyThemeColor(doc: Document, color: string): void {
  if (!color) return;

  for (const meta of doc.querySelectorAll(THEME_COLOR_META_SELECTOR)) {
    meta.setAttribute('content', color);
  }
}

/**
 * The colour the page is actually painted with, read back off `<html>`.
 *
 * Deliberately the computed token rather than a hex handed to the client: the
 * cascade has already answered this question, so this cannot disagree with
 * what is on screen the way a second copy of the palette could. Returns `''`
 * when the stylesheet has not resolved — {@link applyThemeColor} then leaves
 * the existing tags alone.
 */
export function renderedThemeColor(doc: Document): string {
  const view = doc.defaultView;
  if (!view) return '';

  return view
    .getComputedStyle(doc.documentElement)
    .getPropertyValue(THEME_COLOR_TOKEN)
    .trim();
}

/**
 * Bring the browser chrome back in step with `<html data-theme>`.
 *
 * Call after `data-theme` settles, on every change: the attribute is what the
 * visitor chose, and the device preference the meta tags are scoped by is not.
 */
export function syncThemeColor(doc: Document): void {
  applyThemeColor(doc, renderedThemeColor(doc));
}

/**
 * The inline `<head>` script that stamps both attributes before first paint.
 *
 * Built from the constants above so the bootstrap and the React control cannot
 * drift apart. Each `window` access is guarded separately: a `localStorage`
 * that throws used to abort the whole function and ship a page with no
 * `data-theme` at all.
 *
 * It also settles the chrome colour, in the same pass and from the same
 * resolved theme, because a returning visitor whose stored choice contradicts
 * their device would otherwise have the address bar painted from the media
 * query for the whole of the first paint. The colours are passed in rather
 * than read here: they come from `readColorToken`, which reads the filesystem
 * and must not reach the client bundle. They are embedded through
 * `JSON.stringify` so a value can never break out of the string literal.
 */
export function themeInitScript(colors: ThemeColors): string {
  const light = JSON.stringify(colors.light);
  const dark = JSON.stringify(colors.dark);

  return `(function(){var c='system';try{var s=window.localStorage.getItem('${THEME_STORAGE_KEY}');if(s==='light'||s==='dark'){c=s}}catch(e){}var r=document.documentElement;r.setAttribute('${THEME_CHOICE_ATTRIBUTE}',c);var t=c;if(c==='system'){t='light';try{if(window.matchMedia('${DARK_SCHEME_QUERY}').matches){t='dark'}}catch(e){}}r.setAttribute('${THEME_ATTRIBUTE}',t);var k=t==='dark'?${dark}:${light},m=document.querySelectorAll('${THEME_COLOR_META_SELECTOR}');for(var i=0;i<m.length;i++){m[i].setAttribute('content',k)}})();`;
}
