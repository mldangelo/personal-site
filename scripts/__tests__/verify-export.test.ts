import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const verifier = resolve(process.cwd(), 'scripts/verify-export.mjs');
const fixtureRoots: string[] = [];

function write(root: string, path: string, contents = '') {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

function htmlPage({
  canonical,
  content,
  siteRoot,
}: {
  canonical: string;
  content: string;
  siteRoot: string;
}) {
  return `<!doctype html>
<html>
  <head>
    <title>Fixture</title>
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="Fixture">
    <meta property="og:description" content="Fixture description">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Fixture site">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${siteRoot}og.png">
    <meta property="og:image:alt" content="Fixture share card">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@fixture">
    <meta name="twitter:creator" content="@fixture">
    <meta name="twitter:title" content="Fixture">
    <meta name="twitter:description" content="Fixture description">
    <meta name="twitter:image" content="${siteRoot}og.png">
  </head>
  <body>${content}</body>
</html>`;
}

function createFixture({ basePath = '' } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'verify-export-'));
  fixtureRoots.push(root);
  const siteRoot = `https://example.com${basePath}/`;

  write(root, 'package.json', JSON.stringify({ homepage: siteRoot }));
  write(
    root,
    'content/writing/secret-draft.md',
    '---\ntitle: Secret draft\ndraft: true # keep private\n---\n',
  );
  write(
    root,
    'out/index.html',
    htmlPage({
      canonical: siteRoot,
      siteRoot,
      content: `
        <a href="#main-content">Skip</a>
        <a href="about/#section">About section</a>
        <img src="images/photo.png" alt="">
        <main id="main-content">Home</main>
      `,
    }),
  );
  write(
    root,
    'out/about/index.html',
    htmlPage({
      canonical: `${siteRoot}about/`,
      siteRoot,
      content: `
        <a href="#section">This section</a>
        <a href="../#main-content">Home content</a>
        <main id="section">About</main>
      `,
    }),
  );
  write(root, 'out/og.png');
  write(root, 'out/images/photo.png');
  write(
    root,
    'out/sitemap.xml',
    `<?xml version="1.0"?>
<urlset>
  <url><loc>${siteRoot}</loc></url>
  <url><loc>${siteRoot}about/</loc></url>
</urlset>`,
  );
  write(
    root,
    'out/feed.xml',
    `<?xml version="1.0"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <link>${siteRoot}</link>
    <atom:link href="${siteRoot}feed.xml" rel="self"/>
    <item>
      <link>${siteRoot}about/</link>
      <guid isPermaLink="true">${siteRoot}about/</guid>
    </item>
  </channel>
</rss>`,
  );

  return root;
}

function mutate(
  root: string,
  path: string,
  transform: (value: string) => string,
) {
  const file = join(root, path);
  writeFileSync(file, transform(readFileSync(file, 'utf8')));
}

function runVerifier(root: string) {
  const result = spawnSync(process.execPath, [verifier], {
    cwd: root,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  };
}

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('verify-export', () => {
  it('accepts valid root-relative, document-relative, and fragment links', () => {
    const result = runVerifier(createFixture());

    expect(result.status).toBe(0);
    expect(result.output).toContain('2 pages OK');
  });

  it('accepts a repository-site base path', () => {
    const result = runVerifier(createFixture({ basePath: '/personal-site' }));

    expect(result.status).toBe(0);
    expect(result.output).toContain('2 pages OK');
  });

  it('rejects links that escape a configured repository-site base path', () => {
    const root = createFixture({ basePath: '/personal-site' });
    mutate(root, 'out/index.html', (html) =>
      html.replace('href="about/#section"', 'href="/about/#section"'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'internal link points outside configured base path /personal-site/',
    );
  });

  it('rejects a missing same-page fragment', () => {
    const root = createFixture();
    mutate(root, 'out/index.html', (html) =>
      html.replace('href="#main-content"', 'href="#missing"'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'internal link points at missing fragment: /#missing',
    );
  });

  it('rejects a missing cross-page fragment', () => {
    const root = createFixture();
    mutate(root, 'out/index.html', (html) =>
      html.replace('about/#section', 'about/#missing'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'internal link points at missing fragment: /about/#missing',
    );
  });

  it('rejects missing relative routes and local image files', () => {
    const root = createFixture();
    mutate(root, 'out/index.html', (html) =>
      html
        .replace('about/#section', 'missing/')
        .replace('images/photo.png', 'images/missing.png'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'internal link points at missing export: missing/',
    );
    expect(result.output).toContain(
      'image points at missing export: images/missing.png',
    );
  });

  it.each([
    {
      name: 'duplicate canonical links',
      change: (html: string) =>
        html.replace(
          '</head>',
          '<link rel="canonical" href="https://example.com/about/"></head>',
        ),
      expected: 'indexable page has 2 canonical links; expected 1',
    },
    {
      name: 'a foreign canonical origin',
      change: (html: string) =>
        html.replace(
          'rel="canonical" href="https://example.com/about/"',
          'rel="canonical" href="https://wrong.example/about/"',
        ),
      expected:
        'canonical uses https://wrong.example; expected https://example.com',
    },
    {
      name: 'a non-canonical route form',
      change: (html: string) =>
        html.replace(
          'rel="canonical" href="https://example.com/about/"',
          'rel="canonical" href="https://example.com/about"',
        ),
      expected: 'canonical trailing-slash form',
    },
    {
      name: 'og:url that differs from the canonical',
      change: (html: string) =>
        html.replace(
          'property="og:url" content="https://example.com/about/"',
          'property="og:url" content="https://example.com/"',
        ),
      expected: 'does not match canonical',
    },
  ])('rejects $name', ({ change, expected }) => {
    const root = createFixture();
    mutate(root, 'out/about/index.html', change);

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(expected);
  });

  it.each([
    ['Open Graph title', 'property="og:title"', 'og:title'],
    ['Open Graph site name', 'property="og:site_name"', 'og:site_name'],
    ['Twitter card', 'name="twitter:card"', 'twitter:card'],
    ['Twitter creator', 'name="twitter:creator"', 'twitter:creator'],
  ])('rejects a missing %s', (_, attribute, tagName) => {
    const root = createFixture();
    mutate(root, 'out/about/index.html', (html) =>
      html.replace(new RegExp(`\\s*<meta ${attribute}[^>]*>`), ''),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      `indexable page has 0 ${tagName} tags; expected 1`,
    );
  });

  it('rejects draft and missing routes in the sitemap', () => {
    const root = createFixture();
    mutate(root, 'out/sitemap.xml', (xml) =>
      xml.replace(
        '</urlset>',
        '<url><loc>https://example.com/writing/secret-draft/</loc></url></urlset>',
      ),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'sitemap.xml\n    exposes draft route: /writing/secret-draft/',
    );
  });

  it('rejects draft routes in the RSS feed', () => {
    const root = createFixture();
    mutate(root, 'out/feed.xml', (xml) =>
      xml.replace(
        '</channel>',
        '<item><link>https://example.com/writing/secret-draft/</link></item></channel>',
      ),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'feed.xml\n    exposes draft route: /writing/secret-draft/',
    );
  });

  it('requires the sitemap to cover every indexable route', () => {
    const root = createFixture();
    mutate(root, 'out/sitemap.xml', (xml) =>
      xml.replace('  <url><loc>https://example.com/about/</loc></url>\n', ''),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'sitemap.xml\n    omits indexable route: /about/',
    );
  });
});
