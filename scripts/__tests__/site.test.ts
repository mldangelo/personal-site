import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { exportLayout, readSiteConfig, toUrlPath } from '../lib/site.mjs';

/**
 * `scripts/lib/site.mjs` is the single derivation of the exported site's URL
 * shape, and both build gates (`verify-export.mjs`, `measure-export.mjs`) map
 * URLs back to files through it. Almost all of it is inert on this repository,
 * whose `homepage` has no base path — the branches only carry weight in a
 * repository-site fork publishing under `/repo/`, which is precisely where
 * nobody is watching. So every case below is stated for both base-path shapes.
 */

const fixtureRoots: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();
  while (fixtureRoots.length > 0) {
    rmSync(fixtureRoots.pop() as string, { recursive: true, force: true });
  }
});

function fixtureRoot(packageJson: unknown, { write = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'site-config-'));
  fixtureRoots.push(root);
  if (write) {
    writeFileSync(
      join(root, 'package.json'),
      typeof packageJson === 'string'
        ? packageJson
        : JSON.stringify(packageJson),
    );
  }
  return root;
}

/**
 * `readSiteConfig` exits rather than throwing, because every caller is a build
 * gate. Replacing the exit with a throw is what lets a test observe the
 * rejection instead of taking the test runner down with it.
 */
function captureExit() {
  const errors: string[] = [];
  vi.spyOn(console, 'error').mockImplementation((message: string) => {
    errors.push(message);
  });
  vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`process.exit(${code})`);
  }) as never);
  return errors;
}

function expectRejected(homepage: unknown) {
  const errors = captureExit();
  const root = fixtureRoot(
    homepage === undefined ? { name: 'fixture' } : { homepage },
  );
  expect(() => readSiteConfig(root, 'gate')).toThrow('process.exit(1)');
  return errors;
}

describe('readSiteConfig', () => {
  it.each([
    ['a user site', 'https://user.github.io/', 'https://user.github.io', ''],
    [
      'a repository site',
      'https://user.github.io/repo/',
      'https://user.github.io',
      '/repo',
    ],
    ['a custom domain', 'https://example.com/', 'https://example.com', ''],
    [
      'a nested base path',
      'https://example.com/a/b/',
      'https://example.com',
      '/a/b',
    ],
  ])(
    'derives the origin and base path from %s',
    (_, homepage, origin, base) => {
      const root = fixtureRoot({ homepage });

      expect(readSiteConfig(root, 'gate')).toEqual({ origin, basePath: base });
    },
  );

  it('keeps the port in the origin and drops credentials, if any', () => {
    const root = fixtureRoot({ homepage: 'https://example.com:8443/repo/' });

    expect(readSiteConfig(root, 'gate')).toEqual({
      origin: 'https://example.com:8443',
      basePath: '/repo',
    });
  });

  it('strips the base path trailing slash, however many there are', () => {
    // `/repo/` is the shape a fork writes; the base path has to be the prefix
    // that concatenates with a leading-slash route, so it cannot keep one.
    const root = fixtureRoot({ homepage: 'https://example.com/repo//' });

    expect(readSiteConfig(root, 'gate').basePath).toBe('/repo');
  });

  it('accepts a bare origin, which is already a trailing-slash URL', () => {
    // `new URL` normalises the empty path to `/`, so this is a user site with
    // no base path rather than a rejection.
    const root = fixtureRoot({ homepage: 'https://user.github.io' });

    expect(readSiteConfig(root, 'gate')).toEqual({
      origin: 'https://user.github.io',
      basePath: '',
    });
  });

  it('rejects a base path with no trailing slash', () => {
    // Not pedantry: `https://user.github.io/repo` would make the canonical URL
    // of the home page disagree with the exported `/repo/index.html`.
    const errors = expectRejected('https://user.github.io/repo');

    expect(errors[0]).toContain('trailing slash');
  });

  it.each([
    ['plain HTTP', 'http://example.com/'],
    ['a query string', 'https://example.com/?utm=1'],
    ['a fragment', 'https://example.com/#top'],
    ['a protocol-relative URL', '//example.com/'],
    ['a relative path', '/repo/'],
    ['an empty string', ''],
  ])('rejects %s', (_, homepage) => {
    expectRejected(homepage);
  });

  it('rejects a package.json with no homepage at all', () => {
    expectRejected(undefined);
  });

  it('rejects a package.json that is not readable or not JSON', () => {
    const missingErrors = captureExit();
    const missingRoot = fixtureRoot(null, { write: false });
    expect(() => readSiteConfig(missingRoot, 'gate')).toThrow(
      'process.exit(1)',
    );
    expect(missingErrors[0]).toContain('gate:');

    vi.restoreAllMocks();

    const malformedErrors = captureExit();
    const malformedRoot = fixtureRoot('{ "homepage": ');
    expect(() => readSiteConfig(malformedRoot, 'gate')).toThrow(
      'process.exit(1)',
    );
    expect(malformedErrors[0]).toContain('gate:');
  });

  it('prefixes the failure with the caller label so CI logs name the gate', () => {
    const errors = captureExit();
    const root = fixtureRoot({ homepage: 'http://example.com/' });

    expect(() => readSiteConfig(root, 'measure-export')).toThrow(
      'process.exit(1)',
    );
    expect(errors[0]).toMatch(
      /^measure-export: cannot read the canonical site URL from package\.json: /,
    );
  });

  it("accepts this repository's own homepage", () => {
    // The gates read the real `package.json` at build time. A homepage edited
    // into a shape this rejects fails the build rather than the test suite,
    // which is a slower and less obvious way to find out.
    const homepage = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ).homepage as string;
    const { origin, basePath } = readSiteConfig(process.cwd(), 'gate');

    expect(`${origin}${basePath}/`).toBe(homepage);
  });
});

describe('toUrlPath', () => {
  it('joins platform path segments with forward slashes', () => {
    expect(toUrlPath(['writing', 'a-post', 'index.html'].join(sep))).toBe(
      'writing/a-post/index.html',
    );
  });

  it('leaves a single segment alone', () => {
    expect(toUrlPath('index.html')).toBe('index.html');
  });
});

describe.each([
  ['without a base path', ''],
  ['under a repository base path', '/repo'],
])('exportLayout %s', (_, basePath) => {
  const origin = 'https://example.com';

  function layout() {
    const outDir = mkdtempSync(join(tmpdir(), 'site-export-'));
    fixtureRoots.push(outDir);
    return { outDir, ...exportLayout({ outDir, origin, basePath }) };
  }

  const ROUTES = ['/', '/about/', '/writing/a-post/', '/feed.xml'];

  it('exposes the configuration it was built with', () => {
    const { origin: exposed, basePath: exposedBase } = layout();

    expect(exposed).toBe(origin);
    expect(exposedBase).toBe(basePath);
  });

  it('prefixes a route with the base path to get a public path', () => {
    const { publicPathForRoute } = layout();

    expect(publicPathForRoute('/')).toBe(`${basePath}/`);
    expect(publicPathForRoute('/about/')).toBe(`${basePath}/about/`);
  });

  it('builds absolute site URLs from routes', () => {
    const { siteUrlForRoute } = layout();

    expect(siteUrlForRoute('/about/')).toBe(`${origin}${basePath}/about/`);
    expect(siteUrlForRoute('/')).toBe(`${origin}${basePath}/`);
  });

  it('round-trips every route through its public path', () => {
    const { publicPathForRoute, routeForPublicPath } = layout();

    for (const route of ROUTES) {
      expect(routeForPublicPath(publicPathForRoute(route))).toBe(route);
    }
  });

  it('maps exported HTML file paths back to routes', () => {
    const { routeForHtml } = layout();

    // Routes, not public paths: callers prefix them with the base path
    // themselves, and doing it here would double the prefix.
    expect(routeForHtml('index.html')).toBe('/');
    expect(routeForHtml('about/index.html')).toBe('/about/');
    expect(routeForHtml('writing/a-post/index.html')).toBe('/writing/a-post/');
    expect(routeForHtml('404.html')).toBe('/404.html');
  });

  it('resolves a public path to the file backing it', () => {
    const { outDir, exportFileFor, publicPathForRoute } = layout();
    writeFileSync(join(outDir, 'feed.xml'), '<rss/>');
    mkdirSync(join(outDir, 'about'));
    writeFileSync(join(outDir, 'about', 'index.html'), '<html></html>');

    expect(exportFileFor(publicPathForRoute('/feed.xml'))).toBe(
      join(outDir, 'feed.xml'),
    );
    expect(exportFileFor(publicPathForRoute('/about/index.html'))).toBe(
      join(outDir, 'about', 'index.html'),
    );
  });

  it('decodes a percent-encoded public path before resolving it', () => {
    const { outDir, exportFileFor, publicPathForRoute } = layout();
    writeFileSync(join(outDir, 'a file.png'), 'png');

    expect(exportFileFor(publicPathForRoute('/a%20file.png'))).toBe(
      join(outDir, 'a file.png'),
    );
  });

  it('returns undefined for an undecodable public path rather than throwing', () => {
    const { exportFileFor, publicPathForRoute } = layout();

    expect(exportFileFor(publicPathForRoute('/%zz'))).toBeUndefined();
  });

  it('returns undefined for a directory, so a link to one is not "exported"', () => {
    const { outDir, exportFileFor, publicPathForRoute } = layout();
    mkdirSync(join(outDir, 'about'));

    expect(exportFileFor(publicPathForRoute('/about'))).toBeUndefined();
    expect(exportFileFor(publicPathForRoute('/'))).toBeUndefined();
  });

  it('returns undefined for a file that is not in the export', () => {
    const { exportFileFor, publicPathForRoute } = layout();

    expect(exportFileFor(publicPathForRoute('/missing.html'))).toBeUndefined();
  });

  it('refuses to escape the export directory', () => {
    const { outDir, exportFileFor, publicPathForRoute } = layout();
    // A real file, so it is the traversal guard rejecting this and not merely
    // the existence check.
    const sibling = `${outDir}side.txt`;
    writeFileSync(sibling, 'secret');
    fixtureRoots.push(sibling);

    // `..` escapes; the sibling also shares a string prefix with `outDir`,
    // which is why the guard has to compare against `outDir + sep`.
    const leaf = sibling.split(sep).pop() as string;
    expect(exportFileFor(publicPathForRoute(`/../${leaf}`))).toBeUndefined();
    expect(
      exportFileFor(publicPathForRoute(`/%2e%2e/${leaf}`)),
    ).toBeUndefined();
  });
});

describe('exportLayout under a repository base path', () => {
  const origin = 'https://example.com';
  const basePath = '/repo';

  it('rejects a public path outside the base path', () => {
    const { routeForPublicPath } = exportLayout({
      outDir: '/nowhere',
      origin,
      basePath,
    });

    expect(routeForPublicPath('/about/')).toBeUndefined();
    expect(routeForPublicPath('/')).toBeUndefined();
  });

  it('treats the base path as a whole path segment', () => {
    // `/repository/` starts with `/repo` as a string but is a different site.
    const { routeForPublicPath } = exportLayout({
      outDir: '/nowhere',
      origin,
      basePath,
    });

    expect(routeForPublicPath('/repository/')).toBeUndefined();
    expect(routeForPublicPath('/repo')).toBeUndefined();
    expect(routeForPublicPath('/repo/')).toBe('/');
    expect(routeForPublicPath('/repo/about/')).toBe('/about/');
  });

  it('does not resolve a file addressed without the base path', () => {
    // The export is served under `/repo/`, so `/feed.xml` is a link to some
    // other site that happens to share the origin — not to this file.
    const outDir = mkdtempSync(join(tmpdir(), 'site-export-'));
    fixtureRoots.push(outDir);
    writeFileSync(join(outDir, 'feed.xml'), '<rss/>');
    const { exportFileFor } = exportLayout({ outDir, origin, basePath });

    expect(exportFileFor('/feed.xml')).toBeUndefined();
    expect(exportFileFor('/repo/feed.xml')).toBe(join(outDir, 'feed.xml'));
  });

  it('passes any path through untouched when there is no base path', () => {
    const { routeForPublicPath } = exportLayout({
      outDir: '/nowhere',
      origin,
      basePath: '',
    });

    expect(routeForPublicPath('/about/')).toBe('/about/');
    expect(routeForPublicPath('/repo/about/')).toBe('/repo/about/');
  });
});
