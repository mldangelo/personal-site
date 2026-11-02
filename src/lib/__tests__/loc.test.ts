import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { countSourceLines } from '../loc';

const CODE = 'one\ntwo\nthree\n';

describe('countSourceLines', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'loc-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it.each([
    ['no empty segment after a trailing newline', { 'src/a.ts': CODE }, 3],
    ['a file with no trailing newline', { 'src/a.ts': 'one\ntwo\nthree' }, 3],
    ['an empty file as zero', { 'src/empty.ts': '' }, 0],
    ['a lone newline as one line', { 'src/blank.ts': '\n' }, 1],
    ['both source roots', { 'app/page.tsx': CODE, 'src/lib/a.ts': CODE }, 6],
    // The claim is about what ships.
    [
      'no tests',
      {
        'src/a.ts': CODE,
        'src/__tests__/a.test.ts': CODE,
        'src/b.test.tsx': CODE,
        'src/b.spec.ts': CODE,
      },
      3,
    ],
    ['only TypeScript', { 'src/a.ts': CODE, 'src/styles.css': CODE }, 3],
    ['no dependencies', { 'src/node_modules/dep/index.ts': CODE }, 0],
  ])('counts %s', (_, files, expected) => {
    for (const [path, contents] of Object.entries(files)) {
      mkdirSync(join(root, path, '..'), { recursive: true });
      writeFileSync(join(root, path), contents);
    }

    expect(countSourceLines(root)).toBe(expected);
  });

  it('returns zero rather than throwing when a root is absent', () => {
    expect(countSourceLines(root)).toBe(0);
  });

  it('reports a plausible figure for this repository', () => {
    expect(countSourceLines()).toBeGreaterThan(1000);
  });
});
