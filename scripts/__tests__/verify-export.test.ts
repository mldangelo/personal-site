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

interface ResumeFixture {
  basics: { name: unknown };
  work: unknown[];
}

function write(root: string, path: string, contents = '') {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

function htmlPage({
  canonical,
  content,
  head = '',
  siteRoot,
}: {
  canonical: string;
  content: string;
  head?: string;
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
    <link rel="manifest" href="${siteRoot}manifest.json">
    <link rel="icon" href="${siteRoot}favicon.ico">
    <link rel="icon" href="${siteRoot}icon.png">
    <link rel="apple-touch-icon" href="${siteRoot}apple-icon.png">
    ${head}
  </head>
  <body>${content}</body>
</html>`;
}

function createFixture({ basePath = '', draftSlug = 'secret-draft' } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'verify-export-'));
  fixtureRoots.push(root);
  const siteRoot = `https://example.com${basePath}/`;

  write(root, 'package.json', JSON.stringify({ homepage: siteRoot }));
  write(
    root,
    `content/writing/${draftSlug}.md`,
    [
      '---',
      'title: Secret draft',
      "date: '2026-01-01'",
      'description: Private fixture',
      'draft: true # keep private',
      '---',
      '',
    ].join('\n'),
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
      head: `<link rel="alternate" type="application/json" href="${siteRoot}resume.json">`,
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
  write(root, 'out/favicon.ico');
  write(root, 'out/icon.png');
  write(root, 'out/apple-icon.png');
  write(root, 'out/images/icons/app.png');
  write(
    root,
    'out/manifest.json',
    JSON.stringify({
      name: 'Fixture',
      start_url: '.',
      scope: '.',
      icons: [{ src: 'images/icons/app.png' }],
    }),
  );
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

function appendDraftBody(root: string, body: string) {
  mutate(
    root,
    'content/writing/secret-draft.md',
    (markdown) => `${markdown}\n${body}\n`,
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

  it('rejects a missing exported icon target', () => {
    const root = createFixture();
    mutate(root, 'out/index.html', (html) =>
      html.replace('href="https://example.com/icon.png"', 'href="/gone.png"'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'icon link points at missing export: /gone.png',
    );
  });

  it('rejects a manifest icon outside the configured base path', () => {
    const root = createFixture({ basePath: '/personal-site' });
    mutate(root, 'out/manifest.json', (json) =>
      json.replace('images/icons/app.png', '/images/icons/app.png'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'icons[0].src points outside configured base path /personal-site/',
    );
  });

  it('rejects a manifest start URL outside the configured base path', () => {
    const root = createFixture({ basePath: '/personal-site' });
    mutate(root, 'out/manifest.json', (json) =>
      json.replace('"start_url":"."', '"start_url":"/"'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'start_url points outside configured base path /personal-site/',
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

  it('rejects an export with no machine-readable resume', () => {
    const root = createFixture();
    rmSync(join(root, 'out/resume.json'));

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain('resume.json\n    missing from export');
  });

  it('rejects a JSON primitive instead of accepting it as a resume document', () => {
    const root = createFixture();
    write(root, 'out/resume.json', 'null\n');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'resume.json\n    root must be a JSON object',
    );
  });

  it.each([
    {
      name: 'a non-string basics.name',
      change: (resume: ResumeFixture) => {
        resume.basics.name = [];
      },
      expected: 'basics.name must be a non-empty string',
    },
    {
      name: 'a non-object work item',
      change: (resume: ResumeFixture) => {
        resume.work = [1];
      },
      expected: 'work[0] must be a JSON object',
    },
  ])('rejects $name', ({ change, expected }) => {
    const root = createFixture();
    mutate(root, 'out/resume.json', (json) => {
      const resume = JSON.parse(json) as ResumeFixture;
      change(resume);
      return JSON.stringify(resume);
    });

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(expected);
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

  it('rejects a resume page that stops advertising the JSON alternate', () => {
    const root = createFixture();
    mutate(root, 'out/resume/index.html', (html) =>
      html.replace(
        '<link rel="alternate" type="application/json" href="https://example.com/resume.json">',
        '',
      ),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      '/resume/ does not advertise the machine-readable resume',
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
      name: 'an HTML element the plain-text conversion does not strip',
      change: (json: string) =>
        json.replace('Did the work.', 'Shipped a <canvas> renderer.'),
      expected: 'work[0].summary carries markup rather than plain text',
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

  // The exact string `src/lib/__tests__/resumeJson.test.ts` asserts survives
  // `toPlainText` untouched. Kept identical on purpose: the conversion and this
  // gate have to make the same promise, or technical prose passes `npm test`
  // and then fails the export in CI naming markup that was never there.
  it('accepts angle-bracket comparisons and generic types in resume prose', () => {
    const root = createFixture();
    mutate(root, 'out/resume.json', (json) =>
      json.replace(
        'Did the work.',
        'latency < 50ms and throughput > 1k with Map<string, number>',
      ),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
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
      'exports a file named after a draft post: /og/writing/secret-draft.png',
    );
  });

  it('rejects any other export on a draft route', () => {
    const root = createFixture();
    write(root, 'out/writing/secret-draft/notes.pdf');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports a file named after a draft post: /writing/secret-draft/notes.pdf',
    );
  });

  it('rejects noindex HTML named after a draft on the writing route', () => {
    const root = createFixture();
    write(
      root,
      'out/writing/secret-draft.html',
      '<!doctype html><html><head><meta name="robots" content="noindex"></head><body>Draft-derived page</body></html>',
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'exports a file named after a draft post: /writing/secret-draft.html',
    );
  });

  /**
   * Post slugs are ordinary words. Matching a draft slug against every path
   * segment in the export failed the site's own pages: a draft called `about`
   * made `/about/index.html` an error, and one called `sitemap` or `og` did the
   * same to `/sitemap.xml` and `/og.png`.
   */
  it.each(['about', 'og', 'sitemap', 'feed', 'photo', 'index'])(
    'accepts the site\'s own routes and assets against a draft called "%s"',
    (draftSlug) => {
      const result = runVerifier(createFixture({ draftSlug }));

      expect(result.output).toContain('3 pages OK');
      expect(result.status).toBe(0);
    },
  );

  it.each([
    ['a nested-alt inline image', '![nested [alt]](/images/private.png)'],
    [
      'a full reference image',
      '![private][asset]\n\n[asset]: /images/private.png',
    ],
    [
      'a collapsed reference image',
      '![private][]\n\n[private]: /images/private.png',
    ],
    [
      'a shortcut reference image',
      '![private]\n\n[private]: /images/private.png',
    ],
    ['a parent-relative image', '![private](../../images/private.png)'],
    [
      'a same-origin absolute image',
      '![private](https://example.com/images/private.png)',
    ],
    [
      'a same-origin protocol-relative image',
      '![private](//example.com/images/private.png)',
    ],
    [
      'a raw HTML image with a quoted angle bracket',
      '<img alt="private > screenshot" src="/images/private.png">',
    ],
  ])('rejects a draft-only exported asset declared through %s', (_, body) => {
    const root = createFixture();
    write(root, 'out/images/private.png');
    appendDraftBody(root, body);

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'content/writing/secret-draft.md\n    draft references a publicly exported image: /images/private.png',
    );
  });

  it('resolves relative draft assets within a repository-site base path', () => {
    const root = createFixture({ basePath: '/personal-site' });
    write(root, 'out/images/private.png');
    appendDraftBody(root, '![private](../../images/private.png)');

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'draft references a publicly exported image: /personal-site/images/private.png',
    );
  });

  it('rejects every local candidate in a draft HTML srcset', () => {
    const root = createFixture();
    write(root, 'out/images/private-small.webp');
    write(root, 'out/images/private-large.webp');
    appendDraftBody(
      root,
      '<picture><source srcset="/images/private-small.webp 1x, /images/private-large.webp 2x"></picture>',
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'draft references a publicly exported image: /images/private-small.webp',
    );
    expect(result.output).toContain(
      'draft references a publicly exported image: /images/private-large.webp',
    );
  });

  it.each([
    [
      'an image input src',
      '<input type="image" src="/images/private.svg">',
      'out/images/private.svg',
      'image',
    ],
  ])(
    'rejects a draft-only exported resource declared through %s',
    (_, body, exportedPath, kind) => {
      const root = createFixture();
      write(root, exportedPath);
      appendDraftBody(root, body);

      const result = runVerifier(root);
      expect(result.status).toBe(1);
      expect(result.output).toContain(
        `draft references a publicly exported ${kind}`,
      );
    },
  );

  it.each([
    '<div style="background-image:url(/images/private.png)">Private</div>',
    String.raw`<div style="background-image:u\72l(/images/private.png)">Private</div>`,
    '<script src="/scripts/private.js"></script>',
    '<iframe src="data:text/html,<img src=https://example.com/images/private.png>"></iframe>',
    '<object data="data:text/html,<img src=https://example.com/images/private.png>"></object>',
    '<link rel="stylesheet" href="data:text/css,body{background:url(https://example.com/images/private.png)}">',
    '<svg><rect fill="url(/images/private.svg#paint)"></rect></svg>',
    '<svg><image id="i"><set attributeName="href" to="/images/private.png"></set></image></svg>',
  ])('fails closed for an uninspectable draft HTML fetch: %s', (body) => {
    const root = createFixture();
    appendDraftBody(root, body);

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toMatch(/not allowed|cannot be verified/i);
  });

  it('rejects an exported attachment linked only from a draft', () => {
    const root = createFixture();
    write(root, 'out/downloads/private-notes.pdf');
    appendDraftBody(
      root,
      '[private notes][notes]\n\n[notes]: /downloads/private-notes.pdf',
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'draft references a publicly exported link: /downloads/private-notes.pdf',
    );
  });

  it('rejects a draft-only frontmatter image', () => {
    const root = createFixture();
    write(root, 'out/images/private-frontmatter.png');
    mutate(root, 'content/writing/secret-draft.md', (markdown) =>
      markdown.replace(
        'draft: true # keep private',
        [
          'draft: true # keep private',
          'image: /images/private-frontmatter.png',
          'imageAlt: Private screenshot',
        ].join('\n'),
      ),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'draft references a publicly exported image: /images/private-frontmatter.png',
    );
  });

  it('allows a draft to use an asset that an exported page already uses', () => {
    const root = createFixture();
    appendDraftBody(root, '![shared](/images/photo.png)');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
  });

  it('allows draft links to public pages and references to absent private files', () => {
    const root = createFixture();
    appendDraftBody(
      root,
      [
        '[About](/about/)',
        '![kept outside public](/images/not-published.png)',
        '![external](https://cdn.example.net/private-preview.png)',
        '![embedded](data:image/png;base64,AAAA)',
      ].join('\n'),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
  });

  it('fails closed when draft srcset syntax is ambiguous', () => {
    const root = createFixture();
    appendDraftBody(
      root,
      '<source srcset="data:image/png;base64,AAAA, /images/hidden.png 2x">',
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain('srcset');
  });

  it('validates draft frontmatter before trusting its privacy boundary', () => {
    const root = createFixture();
    mutate(root, 'content/writing/secret-draft.md', (markdown) =>
      markdown.replace('draft: true', "draft: 'true'"),
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain('"draft" must be a boolean');
  });

  it('accepts generated share cards for published posts', () => {
    const root = createFixture();
    write(root, 'out/og/writing/about.png');

    const result = runVerifier(root);
    expect(result.status).toBe(0);
    expect(result.output).toContain('3 pages OK');
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
