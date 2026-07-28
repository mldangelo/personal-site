import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reading design tokens out of the stylesheets at build time.
 *
 * A few things outside CSS need a literal colour: the `theme-color` meta tags
 * that paint the browser's own chrome, and the icon generator's tile fill.
 * Neither can resolve a custom property, so the value has to be lifted out of
 * the stylesheet — and typing the hex into TypeScript instead is how the old
 * icon set ended up carrying `#2e59ba` for a year after the palette moved on.
 *
 * Server-only: this reads the filesystem and must not be imported into a
 * client component. Same constraint as `countSourceLines` in `src/lib/loc.ts`.
 */

export type Theme = 'light' | 'dark';

/**
 * Where each theme's values are declared. Light values live in the `@theme`
 * block; dark values are the `[data-theme='dark']` overrides, which is the
 * attribute the inline script in `app/layout.tsx` sets from
 * `prefers-color-scheme`.
 */
const STYLESHEET: Record<Theme, readonly string[]> = {
  light: ['app', 'styles', 'tokens', 'colors.css'],
  dark: ['app', 'styles', 'dark-mode.css'],
};

const CUSTOM_PROPERTY = /^--[a-z0-9-]+$/;
const LITERAL_HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * The literal hex value of one colour token in one theme.
 *
 * Deliberately refuses anything that is not a literal hex. Several tokens are
 * declared as `var()` or `color-mix()`, which is fine in a stylesheet and
 * meaningless in a meta tag or a PNG — so those fail loudly here instead of
 * shipping the string `color-mix(...)` as a colour.
 */
export function readColorToken(
  name: string,
  theme: Theme,
  cwd: string = process.cwd(),
): string {
  if (!CUSTOM_PROPERTY.test(name)) {
    throw new Error(`Not a custom property name: ${name}`);
  }

  const path = join(cwd, ...STYLESHEET[theme]);
  const declaration = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(
    readFileSync(path, 'utf8'),
  );

  if (!declaration) {
    throw new Error(`${name} is not declared in ${path}`);
  }

  const value = declaration[1].trim();

  if (!LITERAL_HEX.test(value)) {
    throw new Error(
      `${name} in ${path} is "${value}", which is not a literal hex colour. ` +
        'Callers outside CSS cannot resolve var() or color-mix().',
    );
  }

  return value.toLowerCase();
}
