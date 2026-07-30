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

import {
  assetRoute,
  declaredAssetRoutes,
  draftOnlyAssetRoutes,
} from '../lib/markdown.mjs';

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
    "---\ntitle: Secret draft\ndate: '2026-01-08'\ndescription: Private fixture post.\ndraft: true # keep private\n---\n",
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
  write(
    root,
    'out/resume/index.html',
    htmlPage({
      canonical: `${siteRoot}resume/`,
      siteRoot,
      content: `
        <a href="../resume.json">JSON</a>
        <main id="resume">Resume</main>
      `,
    }),
  );
  write(
    root,
    'out/resume.json',
    `${JSON.stringify(
      {
        $schema:
          'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
        basics: { name: 'Fixture Person', url: siteRoot },
        work: [
          {
            name: 'Fixture Co',
            position: 'Engineer',
            url: 'https://work.example/',
            startDate: '2020-01-01',
            summary: 'Did the work.',
          },
        ],
        meta: { canonical: `${siteRoot}resume.json` },
      },
      null,
      2,
    )}\n`,
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
  <url><loc>${siteRoot}resume/</loc></url>
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

/** Gives the fixture's draft a body, keeping its `draft: true` frontmatter. */
function draftWithBody(root: string, body: string) {
  write(
    root,
    'content/writing/secret-draft.md',
    `---\ntitle: Secret draft\ndate: '2026-01-08'\ndescription: Private fixture post.\ndraft: true # keep private\n---\n\n${body}\n`,
  );
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
    expect(result.output).toContain('3 pages OK');
  });

  it('accepts a repository-site base path', () => {
    const result = runVerifier(createFixture({ basePath: '/personal-site' }));

    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
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

  /**
   * `public/` now holds a generated share card per published post, so the export
   * can carry an asset derived from `content/writing/`. A card for a draft is
   * not a route and appears in no metadata, so every other gate here would let
   * it through — while the file itself is publicly fetchable with the
   * unpublished title rendered into its pixels.
   */
  it('rejects a generated share card for a draft post', () => {
    const root = createFixture();
    write(root, 'out/og/writing/secret-draft.png');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports an asset named after a draft post: /og/writing/secret-draft.png',
    );
  });

  /**
   * A leaked draft route ships more than its HTML: Next writes an RSC prefetch
   * payload beside every prerendered route, and nothing else here reads it.
   */
  it('rejects a non-HTML file beside a draft route', () => {
    const root = createFixture();
    write(root, 'out/writing/secret-draft/index.txt');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports an asset named after a draft post: /writing/secret-draft/index.txt',
    );
  });

  /**
   * Article images live one directory per post under `public/images/writing/`,
   * and `public/` ships verbatim, so that directory is a real place for a
   * draft's screenshots to become publicly fetchable.
   */
  it('rejects an article image directory named after a draft', () => {
    const root = createFixture();
    write(root, 'out/images/writing/secret-draft/screenshot.webp');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports an asset named after a draft post: /images/writing/secret-draft/screenshot.webp',
    );
  });

  it('accepts generated share cards for published posts', () => {
    const root = createFixture();
    write(root, 'out/og/writing/about.png');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    // Page count tracks `createFixture`, which carries index, about, and
    // resume. A published post's card is not a page and must not change it.
    expect(result.output).toContain('3 pages OK');
  });

  /**
   * The gate is about files generated from `content/writing/`, not about names.
   * Matching a draft slug against any path segment anywhere in `out/` meant a
   * draft called `photo` or `resume` failed the whole build over
   * `images/photo.png` and `resume.json` — committed files nothing derived from
   * a post, reported as a draft leak.
   */
  it('accepts committed assets whose names collide with a draft slug', () => {
    const root = createFixture();
    write(
      root,
      'content/writing/photo.md',
      "---\ntitle: Photo\ndate: '2026-01-08'\ndescription: Draft whose slug matches an asset.\ndraft: true\n---\n",
    );
    write(
      root,
      'content/writing/resume.md',
      "---\ntitle: Resume\ndate: '2026-01-08'\ndescription: Draft whose slug matches an artifact.\ndraft: true\n---\n",
    );

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
  });

  /**
   * The gate and the card generator have to agree on what a draft is.
   * `validatePostFrontmatter` throws for a non-boolean `draft`, so a quoted
   * `draft: 'true'` never builds — but both scripts once read it as published,
   * which is how a card for it got committed with nothing objecting.
   */
  it('rejects malformed draft frontmatter before inspecting generated assets', () => {
    const root = createFixture();
    write(
      root,
      'content/writing/quoted-draft.md',
      "---\ntitle: Quoted draft\ndate: '2026-01-08'\ndescription: Malformed draft fixture.\ndraft: 'true'\n---\n",
    );
    write(root, 'out/og/writing/quoted-draft.png');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'Invalid frontmatter in content/writing/quoted-draft.md: "draft" must be a boolean when provided',
    );
  });

  /**
   * The hole the slug scan cannot cover. A post's screenshots are filed wherever
   * the author filed them, and this repository's draft keeps three in
   * `public/images/writing/codex-desktop-app-post/` — a directory name that is
   * not the slug and is not derived from it, so no filename rule could see it.
   * The post's own Markdown can.
   */
  it('rejects a draft image filed in an arbitrarily named directory', () => {
    const root = createFixture();
    draftWithBody(
      root,
      '![A screenshot](/images/writing/codex-desktop-app-post/overview.webp)',
    );
    write(root, 'out/images/writing/codex-desktop-app-post/overview.webp');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'images/writing/codex-desktop-app-post/overview.webp\n    draft post "secret-draft" references this file',
    );
    expect(result.output).toContain(
      'publicly fetchable at https://example.com/images/writing/codex-desktop-app-post/overview.webp',
    );
  });

  it('rejects a draft image declared only in frontmatter', () => {
    const root = createFixture();
    write(
      root,
      'content/writing/secret-draft.md',
      "---\ntitle: Secret draft\ndate: '2026-01-08'\ndescription: Private fixture post.\ndraft: true\nimage: /images/elsewhere/hero.png\nimageAlt: Hero\n---\n",
    );
    write(root, 'out/images/elsewhere/hero.png');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'images/elsewhere/hero.png\n    draft post "secret-draft" references this file',
    );
  });

  it('accepts article images belonging to a published post', () => {
    const root = createFixture();
    write(
      root,
      'content/writing/published.md',
      "---\ntitle: Published\ndate: '2026-01-08'\ndescription: Published fixture post.\nimage: /images/writing/published/hero.png\nimageAlt: Hero\n---\n\n![Chart](/images/writing/published/chart.png)\n",
    );
    write(root, 'out/images/writing/published/hero.png');
    write(root, 'out/images/writing/published/chart.png');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).not.toContain('warning');
    expect(result.output).toContain('3 pages OK (');
  });

  /**
   * An illustration used by a published post and quoted by a draft still has to
   * ship. Reporting it would be the same false positive the slug scan was
   * narrowed to avoid: a committed file nothing derived from an unpublished
   * post, named as a draft leak.
   */
  it('accepts an image a draft shares with a published post', () => {
    const root = createFixture();
    draftWithBody(root, '![Shared](/images/writing/shared/diagram.png)');
    write(
      root,
      'content/writing/published.md',
      "---\ntitle: Published\ndate: '2026-01-08'\ndescription: Published fixture post.\n---\n\n![Shared](/images/writing/shared/diagram.png)\n",
    );
    write(root, 'out/images/writing/shared/diagram.png');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).not.toContain('warning');
  });

  /**
   * The reference scan matches whole paths, and must not grow into a directory
   * or prefix rule. `-notes.png` is a sibling nothing declared; widening the
   * match to catch it would reintroduce the false-positive class the slug scan
   * was already narrowed to fix.
   */
  it('accepts a neighbouring file whose name only resembles a draft image', () => {
    const root = createFixture();
    draftWithBody(root, '![Shot](/images/writing/loose/shot.webp)');
    write(root, 'out/images/writing/loose/shot-notes.png');
    write(root, 'out/images/writing/loose-extra.png');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).not.toContain('warning');
  });

  /**
   * A remote image names a host, so its path is not a file here. Resolving one
   * as a route would report `out/images/photo.png` — a committed asset the draft
   * never mentioned.
   */
  it('ignores an off-site image reference in a draft', () => {
    const root = createFixture();
    draftWithBody(root, '![Remote](https://cdn.example/images/photo.png)');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).not.toContain('warning');
  });

  it('stays silent about a draft image that is not in the export', () => {
    const root = createFixture();
    draftWithBody(root, '![Missing](/images/writing/loose/absent.webp)');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).not.toContain('warning');
  });

  /**
   * One file, one report. A draft image that also sits under a slug-named
   * directory is caught by both checks, and the fatal one is the one that
   * should speak.
   */
  it('reports a slug-named draft image once, as a failure', () => {
    const root = createFixture();
    draftWithBody(root, '![Shot](/images/writing/secret-draft/shot.webp)');
    write(root, 'out/images/writing/secret-draft/shot.webp');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports an asset named after a draft post: /images/writing/secret-draft/shot.webp',
    );
    expect(result.output).not.toContain('warning');
  });

  it('rejects an export with no machine-readable resume', () => {
    const root = createFixture();
    rmSync(join(root, 'out/resume.json'));

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain('resume.json\n    missing from export');
  });

  it('rejects a resume page that stops linking the artifact', () => {
    const root = createFixture();
    mutate(root, 'out/resume/index.html', (html) =>
      html.replace('href="../resume.json"', 'href="/about/"'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      '/resume/ does not link to the machine-readable resume',
    );
  });

  it.each([
    {
      name: 'HTML left in resume prose',
      change: (json: string) =>
        json.replace('Did the work.', "Did <a href='#'>the work</a>."),
      expected: 'work[0].summary carries markup rather than plain text',
    },
    {
      name: 'a markdown link left in resume prose',
      change: (json: string) =>
        json.replace('Did the work.', 'Did [the work](https://work.example/).'),
      expected: 'work[0].summary carries markup rather than plain text',
    },
    {
      name: 'uncollapsed whitespace in resume prose',
      change: (json: string) => json.replace('Did the work.', 'Did  the work.'),
      expected: 'work[0].summary has uncollapsed whitespace',
    },
    {
      name: 'a key the JSON Resume schema does not define',
      change: (json: string) => json.replace('"work"', '"jobs"'),
      expected: 'key is not part of the JSON Resume schema: jobs',
    },
    {
      name: 'a resume canonical that is not the file-like route',
      change: (json: string) =>
        json.replace('/resume.json"\n  }', '/resume.json/"\n  }'),
      expected: 'meta.canonical is https://example.com/resume.json/',
    },
  ])('rejects $name', ({ change, expected }) => {
    const root = createFixture();
    mutate(root, 'out/resume.json', change);

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(expected);
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

/**
 * `scripts/lib/` is imported directly rather than reached only through the gate,
 * for the reason `site.mjs` and `html.mjs` are: a fixture exercises one shape of
 * input, and the awkward edges here — a title after the destination, an
 * angle-bracketed path, a linked image, a scheme that is not http — never occur
 * in this repository's own posts, so nothing would fail if they stopped working.
 */
describe('assetRoute', () => {
  it.each([
    ['a root-relative path', '/images/writing/post/shot.webp'],
    ['surrounding whitespace', '  /images/writing/post/shot.webp  '],
    ['an angle-bracketed path', '</images/writing/post/shot.webp>'],
    ['a query string', '/images/writing/post/shot.webp?v=2'],
    ['a fragment', '/images/writing/post/shot.webp#top'],
  ])('resolves %s', (_, reference) => {
    expect(assetRoute(reference)).toBe('/images/writing/post/shot.webp');
  });

  it('keeps a percent-encoded path encoded for the export lookup', () => {
    // `exportFileFor` decodes; decoding twice would resolve `%2F` as a
    // separator and reach outside the directory the author named.
    expect(assetRoute('/images/writing/a%20b.png')).toBe(
      '/images/writing/a%20b.png',
    );
  });

  it.each([
    ['an https URL', 'https://cdn.example/images/photo.png'],
    ['an http URL', 'http://cdn.example/images/photo.png'],
    ['a data URI', 'data:image/png;base64,AAAA'],
    ['a protocol-relative URL', '//cdn.example/images/photo.png'],
    ['a document-relative path', 'images/photo.png'],
    ['a parent-relative path', '../images/photo.png'],
    ['the site root', '/'],
    ['an empty reference', '   '],
    ['a non-string', undefined],
  ])('declines %s', (_, reference) => {
    expect(assetRoute(reference)).toBeUndefined();
  });
});

describe('declaredAssetRoutes', () => {
  it('reads the frontmatter image', () => {
    expect([
      ...declaredAssetRoutes({
        data: { image: '/images/writing/post/hero.png' },
        content: '',
      }),
    ]).toEqual(['/images/writing/post/hero.png']);
  });

  it.each([
    ['a plain image', '![Alt](/images/a.png)'],
    ['an image with a caption title', '![Alt](/images/a.png "A caption")'],
    ['an angle-bracketed destination', '![Alt](</images/a.png>)'],
    ['a linked image', '[![Alt](/images/a.png)](https://example.com/)'],
    ['inline HTML', '<img src="/images/a.png" alt="Alt">'],
    ['padding inside the parentheses', '![Alt]( /images/a.png )'],
  ])('reads %s', (_, body) => {
    expect([...declaredAssetRoutes({ data: {}, content: body })]).toEqual([
      '/images/a.png',
    ]);
  });

  it('reads every image in a document once', () => {
    const content = [
      '![One](/images/a.png)',
      'Prose about it.',
      '![Two](/images/b.png)',
      '![One again](/images/a.png)',
    ].join('\n\n');

    expect([...declaredAssetRoutes({ data: {}, content })]).toEqual([
      '/images/a.png',
      '/images/b.png',
    ]);
  });

  /**
   * Unlike the word and reference counts in `og-inputs.mjs`, which measure what
   * a reader sees. This asks which files belong to the post, and a path an
   * author wrote inside a fence is still that answer.
   */
  it('reads a path inside fenced code', () => {
    const content = '```md\n![Alt](/images/a.png)\n```\n';

    expect([...declaredAssetRoutes({ data: {}, content })]).toEqual([
      '/images/a.png',
    ]);
  });

  it('skips remote and relative references', () => {
    const content = [
      '![Remote](https://cdn.example/images/photo.png)',
      '![Relative](images/photo.png)',
      '![Local](/images/a.png)',
    ].join('\n\n');

    expect([...declaredAssetRoutes({ data: {}, content })]).toEqual([
      '/images/a.png',
    ]);
  });

  it('returns nothing for a post with no images and no arguments', () => {
    expect([
      ...declaredAssetRoutes({ data: {}, content: 'Just prose.' }),
    ]).toEqual([]);
    expect([...declaredAssetRoutes()]).toEqual([]);
  });
});

describe('draftOnlyAssetRoutes', () => {
  const post = (slug: string, isDraft: boolean, routes: string[]) => ({
    slug,
    isDraft,
    assets: new Set(routes),
  });

  it('names the draft that declared each asset', () => {
    const owners = draftOnlyAssetRoutes([
      post('secret', true, ['/images/a.png', '/images/b.png']),
    ]);

    expect([...owners]).toEqual([
      ['/images/a.png', 'secret'],
      ['/images/b.png', 'secret'],
    ]);
  });

  it('subtracts assets a published post also declares', () => {
    const owners = draftOnlyAssetRoutes([
      post('secret', true, ['/images/shared.png', '/images/only-draft.png']),
      post('shipped', false, ['/images/shared.png']),
    ]);

    expect([...owners.keys()]).toEqual(['/images/only-draft.png']);
  });

  it('attributes an asset two drafts share to the first of them', () => {
    const owners = draftOnlyAssetRoutes([
      post('first', true, ['/images/a.png']),
      post('second', true, ['/images/a.png']),
    ]);

    expect(owners.get('/images/a.png')).toBe('first');
  });

  it('returns nothing when every post is published', () => {
    expect(
      draftOnlyAssetRoutes([post('shipped', false, ['/images/a.png'])]).size,
    ).toBe(0);
  });
});
