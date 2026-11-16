import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const checker = resolve(process.cwd(), 'scripts/check-pages-url.mjs');
const roots: string[] = [];

function check(homepage: string, pagesUrl: string) {
  const root = mkdtempSync(join(tmpdir(), 'check-pages-url-'));
  roots.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify({ homepage }));
  return spawnSync(process.execPath, [checker], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PAGES_URL: pagesUrl },
  });
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('check-pages-url', () => {
  it.each([
    ['a custom domain', 'https://example.com/', 'https://example.com'],
    [
      'a project site',
      'https://user.github.io/personal-site/',
      'https://user.github.io/personal-site',
    ],
    // Pages reports http:// until HTTPS is enforced.
    ['an unenforced domain', 'https://example.com/', 'http://example.com/'],
  ])('passes %s', (_, homepage, pagesUrl) => {
    expect(check(homepage, pagesUrl).status).toBe(0);
  });

  it('fails a fork that still names the upstream site, and says what to set', () => {
    const result = check(
      'https://mldangelo.com/',
      'https://user.github.io/personal-site',
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'npm pkg set homepage=https://user.github.io/personal-site/',
    );
  });
});
