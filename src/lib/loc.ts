import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const SOURCE_ROOTS = ['app', 'src'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);
const SKIP_DIRECTORIES = new Set(['__tests__', 'node_modules', '.next', 'out']);

function isTestFile(name: string): boolean {
  return /\.(test|spec)\.tsx?$/.test(name) || name.startsWith('vitest.');
}

/**
 * Lines in a file's contents.
 *
 * A file ending in a newline — which nearly every source file does — yields an
 * empty final segment from `split`. Counting that segment inflated the figure
 * by one per file, or 71 phantom lines across this repository.
 */
function countLines(contents: string): number {
  if (contents === '') {
    return 0;
  }

  const segments = contents.split('\n');

  return segments[segments.length - 1] === ''
    ? segments.length - 1
    : segments.length;
}

function countLinesIn(dir: string): number {
  let total = 0;

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry)) {
        total += countLinesIn(path);
      }
      continue;
    }

    if (SOURCE_EXTENSIONS.has(extname(entry)) && !isTestFile(entry)) {
      total += countLines(readFileSync(path, 'utf8'));
    }
  }

  return total;
}

/**
 * Lines of TypeScript powering the site, counted from the working tree at
 * build time.
 *
 * This used to be a number typed into `src/data/stats/site.ts`, which drifted
 * by nearly 2,000 lines. A stats page is the worst place on a site to carry a
 * figure nobody re-checks, so it is now derived. Tests are excluded — the
 * claim is about what ships.
 *
 * Server-only: this reads the filesystem and must not be imported into a
 * client component.
 */
export function countSourceLines(cwd: string = process.cwd()): number {
  return SOURCE_ROOTS.reduce((total, root) => {
    const rootPath = join(cwd, root);
    return existsSync(rootPath) ? total + countLinesIn(rootPath) : total;
  }, 0);
}
