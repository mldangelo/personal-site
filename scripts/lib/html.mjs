/**
 * Shared HTML scraping helpers for the post-build scripts.
 *
 * These read the exported markup as text on purpose. The scripts that use them
 * inspect generated artifacts rather than components, they run after the build
 * with no DOM available, and pulling in a parser to read a handful of
 * attributes would add a dependency with no other use in this repository.
 *
 * Used by `scripts/verify-export.mjs` and `scripts/measure-export.mjs`; the
 * second one exists because a size budget has to resolve the same stylesheet
 * and script references the integrity gate already reads.
 */

export function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    );
}

/** Opening tags only. `name` defaults to any element. */
export function tags(html, name = '[a-z][\\w:-]*') {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(
    (match) => match[0],
  );
}

export function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  return value === undefined ? undefined : decodeHtml(value);
}

export function metaValues(html, key, value) {
  return tags(html, 'meta')
    .filter((tag) => attribute(tag, key)?.toLowerCase() === value)
    .map((tag) => attribute(tag, 'content'))
    .filter((content) => content !== undefined);
}

export function canonicalValues(html) {
  return tags(html, 'link')
    .filter((tag) =>
      (attribute(tag, 'rel') ?? '')
        .toLowerCase()
        .split(/\s+/)
        .includes('canonical'),
    )
    .map((tag) => attribute(tag, 'href'))
    .filter((href) => href !== undefined);
}

/**
 * Whole elements including their markup, for weighing inline payloads.
 *
 * Non-greedy and therefore correct only for elements that do not nest inside
 * themselves. That covers what this is for — inline `<svg>` icons and inline
 * `<style>`/`<script>` bodies — and would silently truncate anything that does
 * nest, so do not reach for it as a general parser.
 */
export function elements(html, name) {
  return [
    ...html.matchAll(
      new RegExp(`<${name}\\b[^>]*>[\\s\\S]*?</${name}\\s*>`, 'gi'),
    ),
  ].map((match) => match[0]);
}
