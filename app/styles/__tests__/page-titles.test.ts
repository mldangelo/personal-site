import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Every page opens in the voice the homepage does: its title in the weight the
 * name is set in. The name was Inter at 500 while each interior title was
 * Inter at 800, the heaviest thing on the site, so the homepage and the pages
 * behind it read as two designs.
 *
 * The four titles live in three stylesheets and the name in a fourth, which is
 * how they drifted apart. jsdom does not resolve the cascade these rules sit
 * in, so the declarations are read from the source.
 */

const STYLES = join(process.cwd(), 'app', 'styles');

/** `font-weight` as declared in the first top-level rule for a selector. */
function declaredWeight(file: string, selector: string): string | undefined {
  const css = readFileSync(join(STYLES, file), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(
    css,
  )?.[1];

  return /font-weight:\s*([^;]+);/.exec(body ?? '')?.[1].trim();
}

const NAME = declaredWeight('pages/home.css', '.hero-name');

describe('page titles', () => {
  // Without this the comparisons below would pass on two rules the reader
  // could not find.
  it('finds the weight the homepage name is set in', () => {
    expect(NAME).toBe('var(--font-weight-medium)');
  });

  it.each([
    ['layout/page.css', '.page-title'],
    ['pages/resume.css', '.resume-title'],
    ['pages/content.css', '.stats-title'],
    ['pages/content.css', '.not-found-title'],
  ])('%s sets %s in the weight of the name', (file, selector) => {
    expect(declaredWeight(file, selector)).toBe(NAME);
  });
});
