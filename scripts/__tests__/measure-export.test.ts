import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const measurer = resolve(process.cwd(), 'scripts/measure-export.mjs');
const fixtureRoots: string[] = [];
const DOCUMENTED_JSON_COMMAND = 'npm run --silent measure-export -- --json -';
const BUDGET = 'scripts/budget.json';

const CSS = 'a'.repeat(4096);
const JS = 'j'.repeat(8192);
const FONT = 'f'.repeat(2048);
const IMAGE = 'i'.repeat(1024);
const ROBOTS = 'r'.repeat(20);
const SITEMAP = 's'.repeat(30);
const RSC_FULL = 'f'.repeat(100);
const RSC_PAGE = 'p'.repeat(50);

/** Stands in for one inlined FontAwesome icon. */
const ICON =
  '<svg class="svg-inline--fa" viewBox="0 0 512 512"><path d="M0 0h512v512H0z"></path></svg>';
/** A second icon, as a design change adding one to the set would produce. */
const SECOND_ICON =
  '<svg class="svg-inline--fa" viewBox="0 0 512 512"><path d="M64 64h384v384H64z"></path></svg>';
const ICON_BYTES = Buffer.byteLength(ICON);

const LINKED_ASSET_BYTES = CSS.length + JS.length + FONT.length;

/** Generous enough that only the budget under test can trip. */
const GENEROUS_BUDGET = {
  _policy: ['fixture'],
  javascriptBytes: 1_000_000,
  cssBytes: 1_000_000,
  fontBytes: 1_000_000,
  maxFileBytes: 1_000_000,
  maxRouteBootstrapBytes: 1_000_000,
  distinctInlineSvgBytes: 1_000_000,
};

type Report = {
  basePath: string;
  total: { files: number; bytes: number };
  groups: { id: string; files: number; bytes: number }[];
  routes: { route: string; linkedAssetBytes: number }[];
  inlineSvg: Record<string, number>;
  budget: { checks: { id: string }[] };
};
type Change = (root: string) => void;

function write(root: string, path: string, contents = '') {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
  return Buffer.byteLength(contents);
}

const remove =
  (...paths: string[]): Change =>
  (root) => {
    for (const path of paths) rmSync(join(root, path), { recursive: true });
  };
const budgetFile =
  (contents: string): Change =>
  (root) => {
    write(root, BUDGET, contents);
  };
const budgetOf = (budget: Record<string, unknown>) =>
  budgetFile(JSON.stringify(budget));

function htmlPage(basePath: string, body: string) {
  return `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="${basePath}/_next/static/css/app.css">
    <link rel="preload" as="font" href="${basePath}/_next/static/media/font.woff2">
    <link rel="preload" as="script" href="${basePath}/_next/static/chunks/main.js">
    <script src="${basePath}/_next/static/chunks/main.js"></script>
  </head>
  <body>
    ${body}
    <img src="${basePath}/images/photo.png" alt="">
    ${ICON}
  </body>
</html>`;
}

function createFixture(basePath = '') {
  const root = mkdtempSync(join(tmpdir(), 'measure-export-'));
  fixtureRoots.push(root);

  write(
    root,
    'package.json',
    JSON.stringify({
      homepage: `https://example.com${basePath}/`,
      scripts: { 'measure-export': `node "${measurer}"` },
    }),
  );
  budgetOf(GENEROUS_BUDGET)(root);

  const documents = {
    '/': write(root, 'out/index.html', htmlPage(basePath, 'Home page body')),
    '/about/': write(root, 'out/about/index.html', htmlPage(basePath, 'About')),
  };

  write(root, 'out/_next/static/css/app.css', CSS);
  write(root, 'out/_next/static/chunks/main.js', JS);
  write(root, 'out/_next/static/media/font.woff2', FONT);
  write(root, 'out/images/photo.png', IMAGE);

  // Two spellings of the same RSC payload plus one route payload, matching what
  // Next writes beside a prerendered route.
  write(root, 'out/index.txt', RSC_FULL);
  write(root, 'out/__next._full.txt', RSC_FULL);
  write(root, 'out/about/__next.about.__PAGE__.txt', RSC_PAGE);

  write(root, 'out/robots.txt', ROBOTS);
  write(root, 'out/sitemap.xml', SITEMAP);

  return { root, documents };
}

function runMeasurer(root: string, args: string[] = []) {
  const result = spawnSync(process.execPath, [measurer, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  };
}

function reportFor(root: string) {
  const run = runMeasurer(root, ['--json', 'report.json']);
  const report = JSON.parse(
    readFileSync(join(root, 'report.json'), 'utf8'),
  ) as Report;
  return { ...run, report };
}

const readBudget = (root: string) =>
  JSON.parse(readFileSync(join(root, BUDGET), 'utf8'));

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('measurements', () => {
  it('groups the export by subsystem, keeping robots.txt out of the RSC group', () => {
    const { root, documents } = createFixture();
    const { status, output, report } = reportFor(root);

    expect(status).toBe(0);
    expect(output).toContain('6 budget(s) within limits');
    expect(
      Object.fromEntries(
        report.groups.map(({ id, files, bytes }) => [id, [files, bytes]]),
      ),
    ).toEqual({
      documents: [2, documents['/'] + documents['/about/']],
      rsc: [3, RSC_FULL.length * 2 + RSC_PAGE.length],
      javascript: [1, JS.length],
      css: [1, CSS.length],
      fonts: [1, FONT.length],
      images: [1, IMAGE.length],
      metadata: [2, ROBOTS.length + SITEMAP.length],
    });
    expect(report.total.files).toBe(11);
    expect(report.total.bytes).toBe(
      report.groups.reduce((sum, group) => sum + group.bytes, 0),
    );
  });

  // The chunk is both preloaded and executed but counts once, and the referenced
  // image stays outside this narrow metric. On a repository site the markup says
  // /personal-site/_next/... while the file is at out/_next/....
  it.each(['', '/personal-site'])(
    'measures a route document and its direct bootstrap links at base path "%s"',
    (basePath) => {
      const { root, documents } = createFixture(basePath);
      const { status, report } = reportFor(root);

      expect(status).toBe(0);
      expect(report.basePath).toBe(basePath);
      expect(report.routes.find(({ route }) => route === '/about/')).toEqual({
        route: '/about/',
        documentBytes: documents['/about/'],
        linkedAssetBytes: LINKED_ASSET_BYTES,
        bootstrapBytes: documents['/about/'] + LINKED_ASSET_BYTES,
      });
    },
  );

  // No gated metric may be a function of the page count: emitted and repeated
  // icon bytes grow with each post, so only the distinct icon set is gated.
  it('moves no budget check when posts are added', () => {
    const { root } = createFixture();
    expect(runMeasurer(root, ['--update-budget']).status).toBe(0);
    const before = reportFor(root).report;
    for (let index = 0; index < 10; index += 1) {
      const post = `out/writing/post-${index}/index`;
      write(root, `${post}.html`, htmlPage('', 'New post'));
      write(root, `${post}.txt`, RSC_FULL);
      write(root, `out/og/post-${index}.png`, IMAGE);
    }

    const { status, report } = reportFor(root);
    expect(status).toBe(0);
    expect(report.total.bytes).toBeGreaterThan(before.total.bytes * 1.2);
    expect(report.budget.checks).toEqual(before.budget.checks);
    expect(report.inlineSvg).toEqual({
      bytes: ICON_BYTES * 12,
      distinct: 1,
      distinctBytes: ICON_BYTES,
      repeatedBytes: ICON_BYTES * 11,
      widestSpread: 12,
    });
  });

  it('prints a report a JSON consumer can read through the documented command', () => {
    expect(readFileSync(measurer, 'utf8')).toContain(DOCUMENTED_JSON_COMMAND);
    const { root } = createFixture();
    const result = spawnSync(
      `${DOCUMENTED_JSON_COMMAND} | "${process.execPath}" -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).total.files"`,
      { cwd: root, encoding: 'utf8', shell: true },
    );

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('11');
    expect(result.stderr).toContain('by subsystem');
  });
});

describe('budget gate', () => {
  // The report is the evidence for the failure, so it is written either way.
  it('names the overage and still writes the JSON report', () => {
    const { root } = createFixture();
    budgetOf({ ...GENEROUS_BUDGET, cssBytes: 1024 })(root);

    const { status, output, report } = reportFor(root);
    expect(status).toBe(1);
    expect(output).toContain('1 budget(s) exceeded');
    expect(output).toContain('CSS (cssBytes)');
    expect(output).toContain('4,096 bytes exceeds the 1,024 budget by 3,072');
    expect(output).toContain('--update-budget');
    expect(report.budget.checks.find(({ id }) => id === 'cssBytes')).toEqual({
      id: 'cssBytes',
      label: 'CSS',
      actual: CSS.length,
      limit: 1024,
      ok: false,
    });
  });

  it.each([['{}'], ['{"_policy":["fixture"]}'], [null]])(
    'bootstraps the complete budget from %s',
    (contents) => {
      const { root } = createFixture();
      remove(BUDGET)(root);
      if (contents !== null) write(root, BUDGET, contents);

      const { status, output } = runMeasurer(root, ['--update-budget']);
      expect(status).toBe(0);
      expect(output).toContain('ratcheted scripts/budget.json');
      expect(Object.keys(readBudget(root))).toEqual(
        Object.keys(GENEROUS_BUDGET),
      );
      expect(runMeasurer(root).status).toBe(0);
    },
  );

  it('ratchets the budget with documented headroom and keeps the policy', () => {
    const { root, documents } = createFixture();
    budgetOf({ ...GENEROUS_BUDGET, cssBytes: 1024 })(root);

    expect(runMeasurer(root, ['--update-budget']).status).toBe(0);

    const budget = readBudget(root);
    expect(budget._policy).toEqual(['fixture']);
    // 15% headroom rounded up to the next KiB: 4096 -> 4710.4 -> 5120.
    expect(budget.cssBytes).toBe(5120);
    const heaviest =
      Math.max(documents['/'], documents['/about/']) + LINKED_ASSET_BYTES;
    expect(budget.maxRouteBootstrapBytes).toBe(
      Math.ceil((heaviest * 1.15) / 1024) * 1024,
    );
  });
});

describe('failures', () => {
  const { fontBytes: _omitted, ...withoutFontBudget } = GENEROUS_BUDGET;
  const badValue = (value: string) =>
    budgetFile(
      JSON.stringify(GENEROUS_BUDGET).replace(
        '"fontBytes":1000000',
        `"fontBytes":${value}`,
      ),
    );
  const noChange: Change = () => {};

  it.each<[string, Change, string[]?]>([
    [
      'bootstrap asset /_next/static/css/app.css, but no exported file resolves from it',
      remove('out/_next/static/css/app.css'),
    ],
    [
      `distinct inline SVG markup (distinctInlineSvgBytes)\n    ${ICON_BYTES + Buffer.byteLength(SECOND_ICON)} bytes exceeds`,
      (root) => {
        budgetOf({ ...GENEROUS_BUDGET, distinctInlineSvgBytes: ICON_BYTES })(
          root,
        );
        write(root, 'out/icons/index.html', htmlPage('', SECOND_ICON));
      },
    ],
    ['missing required budget(s): fontBytes', budgetOf(withoutFontBudget)],
    [
      'unknown budget(s): cssByte',
      budgetOf({ ...GENEROUS_BUDGET, cssByte: 1024 }),
    ],
    ...['"large"', 'null', '[]'].map((contents): [string, Change] => [
      `must be a JSON object mapping budget names to positive byte counts, not ${contents}`,
      budgetFile(contents),
    ]),
    ...[
      ['"1000"'],
      ['null'],
      ['0'],
      ['-1'],
      ['1.5'],
      ['1e999', 'Infinity'],
    ].map(([value, shown = value]): [string, Change] => [
      `invalid budget(s): fontBytes is ${shown}. Every budget must be a positive whole number of bytes.`,
      badValue(value),
    ]),
    ['scripts/budget.json is missing', remove(BUDGET)],
    ['no files found in out/', remove('out')],
    // Per-route metrics read zero off an empty document list, so an export with
    // assets but no HTML fails closed instead of passing those gates.
    [
      'no HTML documents found in out/',
      remove('out/index.html', 'out/about/index.html'),
    ],
    ...[['--json='], ['--json', '']].map((args): [string, Change, string[]] => [
      '--json needs a file path (use `-` for stdout)',
      noChange,
      args,
    ]),
  ])('rejects: %s', (expected, change, args) => {
    const { root } = createFixture();
    change(root);

    const { status, output } = runMeasurer(root, args);
    expect(status).toBe(1);
    expect(output).toContain(expected);
    expect(output).not.toContain('budget(s) within limits');
  });

  // A report inside out/ changes the export it measures, and one written over
  // the budget replaces the policy that gates it.
  it.each([
    ['out/report.json', '--json must write outside out/'],
    [BUDGET, '--json must not overwrite scripts/budget.json'],
  ])('refuses to write the JSON report to %s', (path, expected) => {
    const { root } = createFixture();
    const file = join(root, path);
    const contents = () =>
      existsSync(file) ? readFileSync(file, 'utf8') : undefined;
    const before = contents();

    const { status, output } = runMeasurer(root, ['--json', path]);
    expect(status).toBe(1);
    expect(output).toContain(expected);
    expect(contents()).toBe(before);
  });
});
