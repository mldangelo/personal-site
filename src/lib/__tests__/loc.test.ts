import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { countSourceLines } from '../loc';

let root: string;

/** Writes `lines` lines with no trailing newline. */
function write(relativePath: string, lines: number) {
  writeRaw(
    relativePath,
    Array.from({ length: lines }, () => 'const a = 1;').join('\n'),
  );
}

function writeRaw(relativePath: string, contents: string) {
  const full = join(root, relativePath);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, contents);
}

describe('countSourceLines', () => {
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'loc-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('does not count the empty segment after a trailing newline', () => {
    // Nearly every source file ends in a newline, so this was inflating the
    // published figure by one per file.
    writeRaw('src/a.ts', 'one\ntwo\nthree\n');

    expect(countSourceLines(root)).toBe(3);
  });

  it('counts a file with no trailing newline the same way', () => {
    writeRaw('src/a.ts', 'one\ntwo\nthree');

    expect(countSourceLines(root)).toBe(3);
  });

  it('counts an empty file as zero lines', () => {
    writeRaw('src/empty.ts', '');

    expect(countSourceLines(root)).toBe(0);
  });

  it('counts a file that is only a newline as one line', () => {
    writeRaw('src/blank.ts', '\n');

    expect(countSourceLines(root)).toBe(1);
  });

  it('counts TypeScript across both source roots', () => {
    write('app/page.tsx', 10);
    write('src/lib/thing.ts', 5);

    expect(countSourceLines(root)).toBe(15);
  });

  it('excludes tests, because the claim is about what ships', () => {
    write('src/thing.ts', 4);
    write('src/__tests__/thing.test.ts', 100);
    write('src/other.test.tsx', 100);
    write('src/other.spec.ts', 100);

    expect(countSourceLines(root)).toBe(4);
  });

  it('ignores non-TypeScript files', () => {
    write('src/thing.ts', 3);
    write('src/styles.css', 100);
    write('src/notes.md', 100);

    expect(countSourceLines(root)).toBe(3);
  });

  it('skips build output and dependencies', () => {
    write('src/thing.ts', 2);
    write('src/node_modules/dep/index.ts', 500);

    expect(countSourceLines(root)).toBe(2);
  });

  it('returns zero rather than throwing when a root is absent', () => {
    expect(countSourceLines(root)).toBe(0);
  });

  it('reports a plausible figure for this repository', () => {
    const lines = countSourceLines();

    expect(lines).toBeGreaterThan(1000);
  });
});
