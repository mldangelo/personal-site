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

const HOME = 'out/index.html';
const ABOUT = 'out/about/index.html';
const RESUME_PAGE = 'out/resume/index.html';
const RESUME = 'out/resume.json';
const MANIFEST = 'out/manifest.json';
const SITEMAP = 'out/sitemap.xml';
const FEED = 'out/feed.xml';
const DRAFT = 'content/writing/secret-draft.md';
const BASE_PATH = '/personal-site';
const CANONICAL = 'rel="canonical" href="https://example.com/about';

type Change = (root: string) => void;
type FixtureOptions = { basePath?: string; draftSlug?: string };
/** The test title is the expected message unless a row names itself. */
type Rejection = [expected: string | string[], change: Change, name?: string];

const addFile =
  (path: string, contents = ''): Change =>
  (root) => {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, contents);
  };
const replaceIn =
  (path: string, from: string | RegExp, to: string): Change =>
  (root) => {
    const file = join(root, path);
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(from, () => to),
    );
  };
const both =
  (...changes: Change[]): Change =>
  (root) => {
    for (const change of changes) change(root);
  };
const inHomeBody = (markup: string) =>
  replaceIn(HOME, '</body>', `${markup}</body>`);
const inDraftBody = (body: string) => replaceIn(DRAFT, /$/, `\n${body}\n`);
const inSummary = (text: string) => replaceIn(RESUME, 'Did the work.', text);
/** An exported file that only the draft's body asks for. */
const draftAsset = (body: string, path = 'images/private.png') =>
  both(addFile(`out/${path}`), inDraftBody(body));

const TEXT_META =
  'og:title og:description og:site_name og:locale og:type og:image:alt twitter:card twitter:site twitter:creator twitter:title twitter:description'.split(
    ' ',
  );

function htmlPage(site: string, path: string, body: string, head = '') {
  return `<!doctype html>
<html>
  <head>
    <title>Fixture</title>
    <link rel="canonical" href="${site}${path}">
    <meta property="og:url" content="${site}${path}">
    <meta property="og:image" content="${site}og.png">
    <meta name="twitter:image" content="${site}og.png">
    ${TEXT_META.map((name) => `<meta ${name.startsWith('og:') ? 'property' : 'name'}="${name}" content="Fixture">`).join('\n')}
    <link rel="manifest" href="${site}manifest.json">
    <link rel="icon" href="${site}favicon.ico">
    <link rel="icon" href="${site}icon.png">
    <link rel="apple-touch-icon" href="${site}apple-icon.png">
    ${head}
  </head>
  <body>${body}</body>
</html>`;
}

function createFixture({
  basePath = '',
  draftSlug = 'secret-draft',
}: FixtureOptions = {}) {
  const root = mkdtempSync(join(tmpdir(), 'verify-export-'));
  fixtureRoots.push(root);
  const site = `https://example.com${basePath}/`;

  const files = {
    'package.json': JSON.stringify({ homepage: site }),
    [`content/writing/${draftSlug}.md`]:
      "---\ntitle: Secret draft\ndate: '2026-01-01'\ndescription: Private fixture\ndraft: true # keep private\n---\n",
    [HOME]: htmlPage(
      site,
      '',
      `<a href="#main-content">Skip</a>
      <a href="about/#section">About section</a>
      <img src="images/photo.png" alt="">
      <main id="main-content">Home</main>`,
    ),
    [ABOUT]: htmlPage(
      site,
      'about/',
      `<a href="#section">This section</a>
      <a href="../#main-content">Home content</a>
      <main id="section">About</main>`,
    ),
    [RESUME_PAGE]: htmlPage(
      site,
      'resume/',
      '<a href="../resume.json">JSON</a><main id="resume">Resume</main>',
      `<link rel="alternate" type="application/json" href="${site}resume.json">`,
    ),
    [RESUME]: JSON.stringify({
      $schema:
        'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
      basics: { name: 'Fixture Person', url: site },
      work: [{ url: 'https://work.example/', summary: 'Did the work.' }],
      meta: { canonical: `${site}resume.json` },
    }),
    [MANIFEST]: JSON.stringify({
      start_url: '.',
      scope: '.',
      icons: [{ src: 'images/icons/app.png' }],
    }),
    [SITEMAP]: `<urlset>
  <url><loc>${site}</loc></url>
  <url><loc>${site}about/</loc></url>
  <url><loc>${site}resume/</loc></url>
</urlset>`,
    [FEED]: `<rss xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <link>${site}</link>
    <atom:link href="${site}feed.xml" rel="self"/>
    <item><link>${site}about/</link><guid isPermaLink="true">${site}about/</guid></item>
  </channel>
</rss>`,
    'out/og.png': '',
    'out/favicon.ico': '',
    'out/icon.png': '',
    'out/apple-icon.png': '',
    'out/images/icons/app.png': '',
    'out/images/photo.png': '',
  };
  for (const [path, contents] of Object.entries(files)) {
    addFile(path, contents)(root);
  }

  return root;
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

function rejects(cases: Rejection[], options?: FixtureOptions) {
  const rows = cases.map(([expected, change, name]) => ({
    name: name ?? [expected].flat()[0],
    expected,
    change,
  }));

  it.each(rows)('rejects $name', ({ expected, change }) => {
    const root = createFixture(options);
    change(root);

    const { status, output } = runVerifier(root);
    expect(status).toBe(1);
    for (const message of [expected].flat()) {
      expect(output).toContain(message);
    }
  });
}

function accepts(cases: [string, Change][], options?: FixtureOptions) {
  it.each(cases)('accepts %s', (_name, change) => {
    const root = createFixture(options);
    change(root);

    const { status, output } = runVerifier(root);
    expect(output).toContain('3 pages OK');
    expect(status).toBe(0);
  });
}

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('links, metadata, and icons', () => {
  rejects([
    [
      'icon link points at missing export: /gone.png',
      replaceIn(
        HOME,
        'href="https://example.com/icon.png"',
        'href="/gone.png"',
      ),
    ],
    [
      'internal link points at missing fragment: /#missing',
      replaceIn(HOME, 'href="#main-content"', 'href="#missing"'),
    ],
    [
      'internal link points at missing fragment: /about/#missing',
      replaceIn(HOME, 'about/#section', 'about/#missing'),
    ],
    [
      'internal link points at missing export: missing/',
      replaceIn(HOME, 'about/#section', 'missing/'),
    ],
    [
      'image points at missing export: images/missing.png',
      replaceIn(HOME, 'images/photo.png', 'images/missing.png'),
    ],
    [
      'indexable page has 2 canonical links; expected 1',
      replaceIn(ABOUT, '</head>', `<link ${CANONICAL}/"></head>`),
    ],
    [
      'canonical uses https://wrong.example; expected https://example.com',
      replaceIn(
        ABOUT,
        CANONICAL,
        CANONICAL.replace('example.com', 'wrong.example'),
      ),
    ],
    [
      'canonical trailing-slash form',
      replaceIn(ABOUT, `${CANONICAL}/"`, `${CANONICAL}"`),
    ],
    [
      'does not match canonical',
      replaceIn(
        ABOUT,
        'content="https://example.com/about/"',
        'content="https://example.com/"',
      ),
    ],
    ...['og:title', 'og:site_name', 'twitter:card', 'twitter:creator'].map(
      (name): Rejection => [
        `indexable page has 0 ${name} tags; expected 1`,
        replaceIn(ABOUT, new RegExp(`<meta \\w+="${name}"[^>]*>`), ''),
      ],
    ),
    [
      'sitemap.xml\n    omits indexable route: /about/',
      replaceIn(
        SITEMAP,
        '<url><loc>https://example.com/about/</loc></url>',
        '',
      ),
      'a sitemap that omits an indexable route',
    ],
    [
      'URL is not in canonical trailing-slash form',
      replaceIn(
        SITEMAP,
        'https://example.com/about/',
        'https://example.com/&amp;#97;bout/',
      ),
      'a sitemap URL that only resolves when decoded twice',
    ],
  ]);

  accepts([
    ['root-relative, document-relative, and fragment links', () => {}],
    [
      'an entity-escaped sitemap URL',
      replaceIn(
        SITEMAP,
        'https://example.com/about/',
        'https://example.com/&#97;bout/',
      ),
    ],
  ]);
});

// Every helper that takes a public path has to work when that path carries the
// repository-site prefix, including the `/resume/` lookup the accepted case runs.
describe('at a repository-site base path', () => {
  rejects(
    [
      [
        `internal link points outside configured base path ${BASE_PATH}/`,
        replaceIn(HOME, 'href="about/#section"', 'href="/about/#section"'),
      ],
      [
        `icons[0].src points outside configured base path ${BASE_PATH}/`,
        replaceIn(MANIFEST, 'images/icons/app.png', '/images/icons/app.png'),
      ],
      [
        `start_url points outside configured base path ${BASE_PATH}/`,
        replaceIn(MANIFEST, '"start_url":"."', '"start_url":"/"'),
      ],
      [
        `draft references a publicly exported image: ${BASE_PATH}/images/private.png`,
        draftAsset('![private](../../images/private.png)'),
      ],
      ...[
        '<video src="media/missing.mp4"></video>',
        '<audio src="media/missing.mp3"></audio>',
        '<video><source src="media/missing.webm"></video>',
        '<video poster="media/missing.png"></video>',
        '<video><track src="media/missing.vtt"></video>',
        '<object data="media/missing.pdf"></object>',
        '<embed src="media/missing.pdf">',
        '<iframe src="media/missing.html"></iframe>',
        '<picture><source srcset="images/photo.png 1x, media/missing.png 2x"></picture>',
      ].map(
        (markup): Rejection => [
          'points at missing export: media/missing.',
          inHomeBody(markup),
          `the missing target in ${markup}`,
        ],
      ),
    ],
    { basePath: BASE_PATH },
  );

  accepts(
    [
      ['the unchanged export', () => {}],
      [
        'existing relative media and external media',
        both(
          addFile('out/media/demo.mp4'),
          inHomeBody(
            '<video src="media/demo.mp4" poster="images/photo.png"><source src="https://media.example/demo.webm"></video>',
          ),
        ),
      ],
    ],
    { basePath: BASE_PATH },
  );
});

// A submit control can override a valid form destination, so both attributes are
// checked at root and repository-site deployments.
describe.each(['', BASE_PATH])('form targets at base path "%s"', (basePath) => {
  rejects(
    [
      '<form action="missing/"></form>',
      '<form action="about/"><button formaction="missing/">Submit</button></form>',
      '<form action="about/"><input type="submit" formaction="missing/"></form>',
    ].map((markup) => [
      'form target points at missing export: missing/',
      inHomeBody(markup),
      markup,
    ]),
    { basePath },
  );

  accepts(
    [
      [
        'existing, empty, and external submission targets',
        inHomeBody(`
          <form action="about/?q=hello">
            <button formaction="${basePath}/about/#section">Submit</button>
            <input type="submit" formaction="https://forms.example/submit">
          </form>
          <form action=""><button formaction="">Submit here</button></form>
          <form action="https://forms.example/submit"></form>`),
      ],
    ],
    { basePath },
  );
});

describe('machine-readable resume', () => {
  rejects([
    [
      'resume.json\n    missing from export',
      (root) => rmSync(join(root, RESUME)),
      'an export with no resume.json',
    ],
    [
      'resume.json\n    root must be a JSON object',
      addFile(RESUME, 'null\n'),
      'a JSON primitive as the document',
    ],
    [
      'basics.name must be a non-empty string',
      replaceIn(RESUME, '"Fixture Person"', '[]'),
    ],
    [
      'work[0] must be a JSON object',
      replaceIn(RESUME, /"work":\[.*?\]/, '"work":[1]'),
    ],
    [
      '/resume/ does not link to the machine-readable resume',
      replaceIn(RESUME_PAGE, 'href="../resume.json"', 'href="/about/"'),
    ],
    [
      '/resume/ does not advertise the machine-readable resume',
      replaceIn(RESUME_PAGE, /<link rel="alternate"[^>]*>/, ''),
    ],
    ...[
      "Did <a href='#'>the work</a>.",
      'Did [the work](https://work.example/).',
      // An element the plain-text conversion does not strip.
      'Shipped a <canvas> renderer.',
    ].map(
      (text): Rejection => [
        'work[0].summary carries markup rather than plain text',
        inSummary(text),
        `markup in prose: ${text}`,
      ],
    ),
    ['work[0].summary has uncollapsed whitespace', inSummary('Did  the work.')],
    [
      'key is not part of the JSON Resume schema: jobs',
      replaceIn(RESUME, '"work"', '"jobs"'),
    ],
    [
      'meta.canonical is https://example.com/resume.json/',
      replaceIn(RESUME, '/resume.json"', '/resume.json/"'),
    ],
  ]);

  // The literal `src/lib/__tests__/resumeJson.test.ts` asserts survives
  // `toPlainText`. The conversion and this gate make the same promise, so the
  // two tests share one string.
  accepts([
    [
      'angle-bracket comparisons and generic types in prose',
      inSummary('latency < 50ms and throughput > 1k with Map<string, number>'),
    ],
  ]);
});

// `src/lib/__tests__/markdown-assets.test.ts` owns the grammar of Markdown and
// raw HTML references. These rows cover what the gate adds: resolving a target
// from the post route, ownership against `out/`, and failing on a parser refusal.
describe('drafts', () => {
  rejects([
    [
      'sitemap.xml\n    exposes draft route: /writing/secret-draft/',
      replaceIn(
        SITEMAP,
        '</urlset>',
        '<url><loc>https://example.com/writing/secret-draft/</loc></url></urlset>',
      ),
      'a draft route in the sitemap',
    ],
    [
      'feed.xml\n    exposes draft route: /writing/secret-draft/',
      replaceIn(
        FEED,
        '</channel>',
        '<item><link>https://example.com/writing/secret-draft/</link></item></channel>',
      ),
      'a draft route in the RSS feed',
    ],
    // A card is not a route and appears in no metadata, so only the file-name
    // check catches an unpublished title rendered into a public PNG.
    ...['og/writing/secret-draft.png', 'writing/secret-draft/notes.pdf'].map(
      (path): Rejection => [
        `exports a file named after a draft post: /${path}`,
        addFile(`out/${path}`),
      ],
    ),
    [
      'exports a file named after a draft post: /writing/secret-draft.html',
      addFile(
        'out/writing/secret-draft.html',
        '<!doctype html><html><head><meta name="robots" content="noindex"></head><body>Draft-derived page</body></html>',
      ),
    ],
    ...[
      '![private][asset]\n\n[asset]: /images/private.png',
      '![private](../../images/private.png)',
      '![private](https://example.com/images/private.png)',
      '![private](//example.com/images/private.png)',
      '<img alt="private > screenshot" src="/images/private.png">',
    ].map(
      (body): Rejection => [
        'content/writing/secret-draft.md\n    draft references a publicly exported image: /images/private.png',
        draftAsset(body),
        `a draft-only asset declared through ${body}`,
      ],
    ),
    [
      'draft references a publicly exported link: /downloads/private-notes.pdf',
      draftAsset(
        '[private notes][notes]\n\n[notes]: /downloads/private-notes.pdf',
        'downloads/private-notes.pdf',
      ),
    ],
    [
      'draft references a publicly exported image: /images/private-frontmatter.png',
      both(
        addFile('out/images/private-frontmatter.png'),
        replaceIn(
          DRAFT,
          'draft: true # keep private',
          'draft: true # keep private\nimage: /images/private-frontmatter.png\nimageAlt: Private screenshot',
        ),
      ),
    ],
    // A reference the parsers cannot inspect fails the export.
    [
      'cannot be verified',
      inDraftBody(
        '<div style="background-image:url(/images/private.png)">Private</div>',
      ),
      'an uninspectable draft HTML fetch',
    ],
    [
      'srcset',
      inDraftBody(
        '<source srcset="data:image/png;base64,AAAA, /images/hidden.png 2x">',
      ),
      'ambiguous draft srcset syntax',
    ],
    // Malformed frontmatter must fail here and at the route reader alike, or a
    // draft flag the reader rejects could pass this privacy boundary.
    [
      '"draft" must be a boolean',
      replaceIn(DRAFT, 'draft: true', "draft: 'true'"),
    ],
  ]);

  accepts([
    [
      'a draft using an asset an exported page already uses',
      inDraftBody('![shared](/images/photo.png)'),
    ],
    [
      'draft links to public pages and references to absent private files',
      inDraftBody(
        [
          '[About](/about/)',
          '![kept outside public](/images/not-published.png)',
          '![external](https://cdn.example.net/private-preview.png)',
          '![embedded](data:image/png;base64,AAAA)',
        ].join('\n'),
      ),
    ],
    [
      'a generated share card for a published post',
      addFile('out/og/writing/about.png'),
    ],
  ]);

  // Post slugs are ordinary words, so a draft sharing a name with one of the
  // site's own routes or assets must not fail a clean export.
  describe.each(['about', 'og', 'sitemap', 'feed', 'photo', 'index'])(
    'called "%s"',
    (draftSlug) => {
      accepts([['the site’s own routes and assets', () => {}]], { draftSlug });
    },
  );
});
