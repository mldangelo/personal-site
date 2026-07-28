import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Structural guards on the stylesheet graph.
 *
 * `app/tailwind.css` is the single entry point — `app/layout.tsx` imports
 * nothing else — so a stylesheet that is not reachable from it ships no bytes,
 * and an import with no file behind it breaks the build.
 */

const REPO_ROOT = resolve(__dirname, '../../..');
const ENTRY = join(REPO_ROOT, 'app/tailwind.css');
const STYLES_DIR = join(REPO_ROOT, 'app/styles');

const IMPORT_PATTERN = /@import\s+['"]([^'"]+)['"]/g;
const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function cssFilesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      return cssFilesUnder(path);
    }

    return path.endsWith('.css') ? [path] : [];
  });
}

function repoPath(file: string): string {
  return relative(REPO_ROOT, file).split(/[\\/]/).join(posix.sep);
}

/**
 * Relative `@import` targets in a stylesheet, resolved to absolute paths,
 * whether or not the file exists. Bare specifiers such as `tailwindcss`
 * resolve from node_modules and are not the graph's business.
 */
function importTargetsOf(file: string): string[] {
  const contents = readFileSync(file, 'utf8');

  return [...contents.matchAll(IMPORT_PATTERN)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'))
    .map((specifier) => resolve(dirname(file), specifier));
}

/** Every stylesheet reachable from the entry point, following `@import`. */
function reachableFrom(entry: string): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];

  while (queue.length > 0) {
    const file = queue.pop() as string;

    // A dangling import is reported by its own test; skipping it here keeps
    // the walk from throwing and taking the whole suite down with it.
    if (seen.has(file) || !isFile(file)) {
      continue;
    }
    seen.add(file);

    for (const imported of importTargetsOf(file)) {
      queue.push(imported);
    }
  }

  return seen;
}

/** A stylesheet's content with comments and surrounding whitespace stripped. */
function declarationsOf(file: string): string {
  return readFileSync(file, 'utf8').replace(COMMENT_PATTERN, '').trim();
}

const stylesheets = cssFilesUnder(STYLES_DIR);
const reachable = reachableFrom(ENTRY);

describe('stylesheet graph', () => {
  it('finds stylesheets to check', () => {
    expect(stylesheets.length).toBeGreaterThan(0);
  });

  it('resolves every @import to a file that exists', () => {
    const dangling = [ENTRY, ...stylesheets].flatMap((file) =>
      importTargetsOf(file)
        .filter((imported) => !isFile(imported))
        .map((imported) => `${repoPath(file)} → ${repoPath(imported)}`),
    );

    expect(dangling).toEqual([]);
  });

  it('reaches every stylesheet from app/tailwind.css', () => {
    const orphans = stylesheets
      .filter((file) => !reachable.has(file))
      .map(repoPath);

    expect(orphans).toEqual([]);
  });

  it('ships no comment-only placeholder stylesheets', () => {
    // `components/forms.css` was seven lines saying form styles "would go here
    // if needed in the future". It was imported, and it emitted nothing.
    const empty = stylesheets
      .filter((file) => declarationsOf(file) === '')
      .map(repoPath);

    expect(empty).toEqual([]);
  });
});

describe('view transitions', () => {
  // `@view-transition` is the cross-document API. The App Router intercepts
  // every `<Link>` into a same-document client navigation, so root-level
  // view-transition CSS is inert unless Next is asked to drive transitions
  // itself. Shipping it without the flag is a no-op that reads as a feature.
  it('are not styled unless next.config.mjs enables them', () => {
    const styled = [ENTRY, ...stylesheets]
      .filter((file) =>
        /@view-transition|::view-transition-(old|new)\b/.test(
          declarationsOf(file),
        ),
      )
      .map(repoPath);

    if (styled.length === 0) {
      return;
    }

    const config = readFileSync(join(REPO_ROOT, 'next.config.mjs'), 'utf8');

    expect(
      /viewTransition\s*:\s*true/.test(config),
      `${styled.join(', ')} styles view transitions, but next.config.mjs does not set experimental.viewTransition, so none of it fires`,
    ).toBe(true);
  });
});
