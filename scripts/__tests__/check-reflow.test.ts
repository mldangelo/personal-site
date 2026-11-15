import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { findChrome } from '../lib/chrome.mjs';

const checker = resolve(process.cwd(), 'scripts/check-reflow.mjs');
const fixtureRoots: string[] = [];

// A gate that never runs passes every build, so CI must have a browser.
const runs = Boolean(findChrome() || process.env.CI);

function page(body: string) {
  return `<!doctype html>
<html>
  <head><meta name="viewport" content="width=device-width"></head>
  <body>${body}</body>
</html>`;
}

function fixture(basePath: string, pages: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'check-reflow-'));
  fixtureRoots.push(root);
  const files = {
    'package.json': JSON.stringify({
      homepage: `https://example.com${basePath}/`,
    }),
    ...Object.fromEntries(
      Object.entries(pages).map(([path, html]) => [`out/${path}`, html]),
    ),
  };
  for (const [path, contents] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  }
  return root;
}

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe.skipIf(!runs)('check-reflow', () => {
  it('names the page, view, and box that outgrow the viewport', () => {
    // 18rem fits a 320px phone at the default text size and doubles past it.
    const root = fixture('/repo', {
      'index.html': page('<p>Fits at every size.</p>'),
      'wide/index.html': page(
        '<div class="spacer" style="width: 18rem; height: 1rem"></div>',
      ),
    });

    const run = spawnSync(process.execPath, [checker], {
      cwd: root,
      encoding: 'utf8',
      timeout: 60_000,
    });

    expect(run.stderr).toContain('1 page view(s) wider than the viewport');
    expect(run.stderr).toMatch(
      /\/wide\/ at 320px, 200% text is \d+px wide\n {4}div\.spacer reaches \d+px/,
    );
    expect(run.status).toBe(1);
  }, 90_000);
});
