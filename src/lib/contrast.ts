/**
 * WCAG 2.1 relative luminance and contrast ratio, for opaque sRGB hex colours.
 *
 * This exists so the colour tokens can be checked at build time instead of
 * eyeballed. It is a FLOOR, not a proof: it compares two flat token values,
 * and several surfaces on this site are not flat. The paper grain
 * (`body::before`), the header's `backdrop-filter`, and the hero portrait's
 * `mix-blend-mode: multiply` all sit between the two colours a token pair
 * describes, so a pair can pass here while the rendered pixels fail. Treat a
 * pass as "the tokens are not obviously wrong" and check real surfaces by eye.
 *
 * Deliberately no dependency: the whole calculation is a dozen lines and a
 * package would need pinning, auditing, and upgrading for it.
 */

/** WCAG 2.1 SC 1.4.3 — normal-size body text. */
export const AA_TEXT = 4.5;

/** WCAG 2.1 SC 1.4.3 — large text (>=24px, or >=18.66px bold). */
export const AA_LARGE_TEXT = 3;

/** WCAG 2.1 SC 1.4.11 — non-text graphics and UI component boundaries. */
export const AA_NON_TEXT = 3;

/**
 * `#rgb` or `#rrggbb` (with an optional leading `#`) to 0-255 channels.
 *
 * Alpha-bearing forms intentionally throw. A translucent colour has no single
 * luminance until it is composited over an explicit backdrop; dropping alpha
 * would, for example, score transparent black as opaque black. Anything else
 * also throws rather than silently scoring black.
 */
export function parseHexColor(hex: string): [number, number, number] {
  const body = hex.trim().replace(/^#/, '');

  if ((body.length === 4 || body.length === 8) && /^[0-9a-fA-F]+$/.test(body)) {
    throw new Error(
      `Alpha-bearing hex colours need an explicit backdrop: ${hex}`,
    );
  }

  const expanded =
    body.length === 3
      ? body
          .split('')
          .map((c) => c + c)
          .join('')
      : body;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Not an opaque sRGB hex colour: ${hex}`);
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
}

/** sRGB 0-255 channel to its linear-light value. */
function linearize(channel: number): number {
  const c = channel / 255;

  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.1 relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHexColor(hex);

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG 2.1 contrast ratio between two opaque colours, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);

  return (lighter + 0.05) / (darker + 0.05);
}
