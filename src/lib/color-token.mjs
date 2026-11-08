import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reading design tokens out of the stylesheets at build time.
 *
 * A few things outside CSS need a literal colour: the `theme-color` meta tags
 * that paint the browser's own chrome, the icon tile, and the share cards.
 * None of them can resolve a custom property, so the value is lifted out of the
 * stylesheet rather than typed into a second file that nothing checks.
 *
 * Plain ESM so the site and the plain Node generators share this one reader.
 * Server-only: it reads the filesystem and must not be imported into a client
 * component.
 */

/**
 * Where each theme's values are declared. Light values live in the `@theme`
 * block; dark values are the `[data-theme='dark']` overrides, which is the
 * attribute the inline script in `app/layout.tsx` sets from a stored site
 * choice first, then from `prefers-color-scheme`.
 */
const STYLESHEET = {
  light: ['app', 'styles', 'tokens', 'colors.css'],
  dark: ['app', 'styles', 'dark-mode.css'],
};

const CUSTOM_PROPERTY = /^--[a-z0-9-]+$/;

/** Hex, or `rgb()`/`rgba()` with numeric arguments: nothing that can carry a quote or a tag. */
const LITERAL_COLOR =
  /^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([\d\s.,%/]+\))$/i;

/**
 * The literal value of one colour token in one theme.
 *
 * Refuses anything that is not a literal colour. Several tokens are declared
 * as `var()` or `color-mix()`, which is fine in a stylesheet and meaningless in
 * a meta tag or a PNG, so those fail loudly here instead of shipping the string
 * `color-mix(...)` as a colour.
 *
 * @param {string} name
 * @param {import('./theme').ResolvedTheme} theme
 * @param {string} [root]
 * @returns {string}
 */
export function readColorToken(name, theme, root = process.cwd()) {
  if (!CUSTOM_PROPERTY.test(name)) {
    throw new Error(`Not a custom property name: ${name}`);
  }

  const path = join(root, ...STYLESHEET[theme]);
  const declaration = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(
    readFileSync(path, 'utf8'),
  );

  if (!declaration) {
    throw new Error(`${name} is not declared in ${path}`);
  }

  const value = declaration[1].trim();

  if (!LITERAL_COLOR.test(value)) {
    throw new Error(
      `${name} in ${path} is "${value}", which is not a literal colour. ` +
        'Callers outside CSS cannot resolve var() or color-mix().',
    );
  }

  return value.toLowerCase();
}
