/**
 * Runtime theme values shared by the pre-paint bootstrap and the client
 * toggle.
 *
 * Browser chrome follows the resolved `data-theme`, not the device preference:
 * a saved site choice is allowed to disagree with the device. Since
 * `theme-color` cannot be selected by an HTML attribute, script owns one
 * unscoped meta tag and updates its `content`.
 */

export type ResolvedTheme = 'light' | 'dark';

export type ThemeColors = Readonly<Record<ResolvedTheme, string>>;

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_COLOR_TOKEN = '--color-bg-alt';
export const THEME_STORAGE_KEY = 'theme';
export const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';
export const RESOLVED_THEME_COLOR_ATTRIBUTE = 'data-theme-color';
export const RESOLVED_THEME_COLOR_SELECTOR = `${THEME_COLOR_META_SELECTOR}[${RESOLVED_THEME_COLOR_ATTRIBUTE}]`;

/**
 * Returns the meta tag that carries the resolved theme, creating it when the
 * page did not run the bootstrap (for example, a component test).
 *
 * This tag is intentionally not rendered by React. Next re-hoists metadata on
 * client navigation and can restore React-owned tags from the route payload.
 * A separate tag survives those navigations. It is prepended and unscoped so
 * it is the first matching `theme-color` declaration.
 */
function resolvedThemeColorMeta(doc: Document): HTMLMetaElement {
  const existing = doc.head.querySelector<HTMLMetaElement>(
    RESOLVED_THEME_COLOR_SELECTOR,
  );
  if (existing) return existing;

  const meta = doc.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  meta.setAttribute(RESOLVED_THEME_COLOR_ATTRIBUTE, '');
  doc.head.prepend(meta);

  return meta;
}

export function applyThemeColor(doc: Document, color: string): void {
  if (!color) return;
  resolvedThemeColorMeta(doc).setAttribute('content', color);
}

/**
 * Reads the chrome colour back from the cascade after `data-theme` changes,
 * avoiding a second client-side copy of the palette.
 */
export function renderedThemeColor(doc: Document): string {
  const view = doc.defaultView;
  if (!view) return '';

  return view
    .getComputedStyle(doc.documentElement)
    .getPropertyValue(THEME_COLOR_TOKEN)
    .trim();
}

export function syncThemeColor(doc: Document): void {
  applyThemeColor(doc, renderedThemeColor(doc));
}

/**
 * Parser-blocking bootstrap used in `app/layout.tsx`.
 *
 * The palette is supplied from the build-time token reader because stylesheets
 * are not guaranteed to have resolved before this script runs. Every browser
 * API read is guarded independently so blocked storage cannot prevent the
 * device preference from resolving.
 */
export function themeInitScript(colors: ThemeColors): string {
  const light = JSON.stringify(colors.light);
  const dark = JSON.stringify(colors.dark);

  return `(function(){var t='light',s=null;try{s=window.localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}if(s==='light'||s==='dark'){t=s}else{try{if(window.matchMedia('${DARK_SCHEME_QUERY}').matches){t='dark'}}catch(e){}}document.documentElement.setAttribute('${THEME_ATTRIBUTE}',t);var m=document.head.querySelector('${RESOLVED_THEME_COLOR_SELECTOR}');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');m.setAttribute('${RESOLVED_THEME_COLOR_ATTRIBUTE}','');document.head.prepend(m)}m.setAttribute('content',t==='dark'?${dark}:${light})})();`;
}
