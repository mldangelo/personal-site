import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { THEME_COLOR_TOKEN } from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';

/**
 * `app/tailwind.css` is the only stylesheet `app/layout.tsx` imports, and no
 * stylesheet imports another. A file under `app/styles` the entry point does
 * not list ships nothing; an import with no file behind it breaks the build.
 */

const REPO_ROOT = resolve(__dirname, '../../..');
const ENTRY = join(REPO_ROOT, 'app/tailwind.css');
const STYLES_DIR = join(REPO_ROOT, 'app/styles');

const COMMENT = /\/\*[\s\S]*?\*\//g;
const RELATIVE_IMPORT = /@import\s+['"](\.[^'"]+)['"]/g;

function withoutComments(file: string): string {
  return readFileSync(file, 'utf8').replace(COMMENT, '');
}

function repoPaths(files: string[]): string[] {
  return files.map((file) => relative(REPO_ROOT, file)).sort();
}

const onDisk = readdirSync(STYLES_DIR, { encoding: 'utf8', recursive: true })
  .filter((entry) => entry.endsWith('.css'))
  .map((entry) => join(STYLES_DIR, entry));

const imported = [...withoutComments(ENTRY).matchAll(RELATIVE_IMPORT)].map(
  (match) => resolve(dirname(ENTRY), match[1]),
);

describe('stylesheet graph', () => {
  it('imports every stylesheet under app/styles, and only those', () => {
    expect(repoPaths(imported)).toEqual(repoPaths(onDisk));
  });

  it('ships no comment-only stylesheets', () => {
    const empty = onDisk.filter((file) => withoutComments(file).trim() === '');

    expect(repoPaths(empty)).toEqual([]);
  });
});

// Let the production optimiser add the prefixes its browser targets need.
it('does not hand-write -webkit-backdrop-filter', () => {
  const prefixed = onDisk.filter((file) =>
    /-webkit-backdrop-filter\s*:/.test(withoutComments(file)),
  );

  expect(repoPaths(prefixed)).toEqual([]);
});

it('keeps the header opaque and aligned with the browser chrome', () => {
  const css = withoutComments(join(STYLES_DIR, 'layout/header.css'));
  const headerRules = [...css.matchAll(/\.site-header\s*\{([^{}]*)\}/g)]
    .map((match) => match[1])
    .join('\n');
  const backgrounds = [
    ...headerRules.matchAll(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;{}]+)/g),
  ].map((match) => match[1].trim());

  expect(backgrounds).toEqual([`var(${THEME_COLOR_TOKEN})`]);
  expect(headerRules).not.toMatch(/backdrop-filter\s*:/);
  for (const theme of ['light', 'dark'] as const) {
    expect(readColorToken(THEME_COLOR_TOKEN, theme)).toMatch(
      /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/,
    );
  }
});
