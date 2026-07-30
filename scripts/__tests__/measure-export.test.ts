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

const measurer = resolve(process.cwd(), 'scripts/measure-export.mjs');
const fixtureRoots: string[] = [];
const DOCUMENTED_JSON_COMMAND = 'npm run --silent measure-export -- --json -';
const PARSE_STDIN = `let text = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { text += chunk; });
process.stdin.on('end', () => {
  process.stdout.write(String(JSON.parse(text).total.files));
});
`;

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

const LINKED_ASSET_BYTES = CSS.length + JS.length + FONT.length;

/** Generous enough that only the budget under test can trip. */
const GENEROUS_BUDGET = {
  _policy: ['fixture'],
  totalBytes: 10_000_000,
  javascriptBytes: 1_000_000,
  cssBytes: 1_000_000,
  fontBytes: 1_000_000,
  maxFileBytes: 1_000_000,
  maxRouteBootstrapBytes: 1_000_000,
  repeatedInlineSvgBytes: 1_000_000,
};

type Report = {
  basePath: string;
  total: { files: number; bytes: number };
  groups: { id: string; files: number; bytes: number; share: number }[];
  largestFiles: { path: string; bytes: number; group: string }[];
  routes: {
    route: string;
    documentBytes: number;
    linkedAssetBytes: number;
    bootstrapBytes: number;
  }[];
  inlineSvg: {
    bytes: number;
    distinct: number;
    repeatedBytes: number;
    widestSpread: number;
  };
  budget: {
    checks: {
      id: string;
      actual: number;
      limit: number | null;
      ok: boolean;
    }[];
  };
};

function write(root: string, path: string, contents = '') {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
  return Buffer.byteLength(contents);
}

function htmlPage(basePath: string, body: string) {
  const asset = (path: string) => `${basePath}${path}`;
  return `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="${asset('/_next/static/css/app.css')}">
    <link rel="preload" as="font" href="${asset('/_next/static/media/font.woff2')}">
    <link rel="preload" as="script" href="${asset('/_next/static/chunks/main.js')}">
    <script src="${asset('/_next/static/chunks/main.js')}"></script>
  </head>
  <body>
    ${body}
    <img src="${asset('/images/photo.png')}" alt="">
    ${ICON}
  </body>
</html>`;
}

function createFixture({
  basePath = '',
  budget = GENEROUS_BUDGET as Record<string, unknown> | null,
} = {}) {
  const root = mkdtempSync(join(tmpdir(), 'measure-export-'));
  fixtureRoots.push(root);

  write(
    root,
    'package.json',
    JSON.stringify({
      name: 'measure-export-fixture',
      version: '0.0.0',
      private: true,
      homepage: `https://example.com${basePath}/`,
      scripts: { 'measure-export': `node "${measurer}"` },
    }),
  );
  write(root, 'parse-stdin.mjs', PARSE_STDIN);
  mkdirSync(join(root, 'scripts'), { recursive: true });
  if (budget) {
    write(root, 'scripts/budget.json', JSON.stringify(budget, null, 2));
  }

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
    stdout: result.stdout,
    stderr: result.stderr,
    output: `${result.stdout}${result.stderr}`,
  };
}

function runPipeline(root: string, command: string) {
  const result = spawnSync(command, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function reportFor(root: string, args: string[] = []) {
  const run = runMeasurer(root, ['--json', 'report.json', ...args]);
  const report = JSON.parse(
    readFileSync(join(root, 'report.json'), 'utf8'),
  ) as Report;
  return { ...run, report };
}

const groupIn = (report: Report, id: string) =>
  report.groups.find((group) => group.id === id);
const routeIn = (report: Report, route: string) =>
  report.routes.find((entry) => entry.route === route);
const checkIn = (report: Report, id: string) =>
  report.budget.checks.find((check) => check.id === id);

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('measure-export', () => {
  it('groups the export by subsystem and passes a generous budget', () => {
    const { root, documents } = createFixture();
    const { status, output, report } = reportFor(root);

    expect(status).toBe(0);
    expect(output).toContain('7 budget(s) within limits');

    expect(groupIn(report, 'documents')).toMatchObject({
      files: 2,
      bytes: documents['/'] + documents['/about/'],
    });
    expect(groupIn(report, 'javascript')).toMatchObject({
      files: 1,
      bytes: JS.length,
    });
    expect(groupIn(report, 'css')).toMatchObject({
      files: 1,
      bytes: CSS.length,
    });
    expect(groupIn(report, 'fonts')).toMatchObject({
      files: 1,
      bytes: FONT.length,
    });
    expect(groupIn(report, 'images')).toMatchObject({
      files: 1,
      bytes: IMAGE.length,
    });
    expect(report.total.files).toBe(11);
    expect(report.total.bytes).toBe(
      report.groups.reduce((sum, group) => sum + group.bytes, 0),
    );
  });

  it('counts RSC prefetch payloads separately from robots.txt', () => {
    const { report } = reportFor(createFixture().root);

    // Both `index.txt` spellings plus the route payload, and nothing else.
    expect(groupIn(report, 'rsc')).toMatchObject({
      files: 3,
      bytes: RSC_FULL.length * 2 + RSC_PAGE.length,
    });
    expect(groupIn(report, 'metadata')).toMatchObject({
      files: 2,
      bytes: ROBOTS.length + SITEMAP.length,
    });
    expect(
      report.largestFiles.find((file) => file.path === 'robots.txt')?.group,
    ).not.toBe('rsc');
  });

  it('measures each route document and its direct bootstrap links', () => {
    const { root, documents } = createFixture();
    const { report } = reportFor(root);

    // The stylesheet, the font, and the chunk, counted once even though the
    // chunk is both preloaded and executed. The referenced image is deliberately
    // outside this narrow metric and remains covered by the export total.
    expect(routeIn(report, '/about/')).toEqual({
      route: '/about/',
      documentBytes: documents['/about/'],
      linkedAssetBytes: LINKED_ASSET_BYTES,
      bootstrapBytes: documents['/about/'] + LINKED_ASSET_BYTES,
    });
  });

  it('resolves bootstrap links through a repository-site base path', () => {
    const { root } = createFixture({ basePath: '/personal-site' });
    const { status, report } = reportFor(root);

    expect(status).toBe(0);
    expect(report.basePath).toBe('/personal-site');
    // Markup says /personal-site/_next/..., the file is at out/_next/...; a
    // hand-rolled prefix strip resolves nothing and reports 0 asset bytes.
    expect(routeIn(report, '/about/')?.linkedAssetBytes).toBe(
      LINKED_ASSET_BYTES,
    );
  });

  it('counts inline icon markup that repeats across documents', () => {
    const { report } = reportFor(createFixture().root);

    expect(report.inlineSvg).toEqual({
      bytes: Buffer.byteLength(ICON) * 2,
      distinct: 1,
      repeatedBytes: Buffer.byteLength(ICON),
      widestSpread: 2,
    });
  });

  it('fails when a budget is exceeded and names the overage', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssBytes: 1024 },
    });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('1 budget(s) exceeded');
    expect(output).toContain('CSS (cssBytes)');
    expect(output).toContain('4,096 bytes exceeds the 1,024 budget by 3,072');
    expect(output).toContain('--update-budget');
  });

  it('still writes the JSON report when a budget fails', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssBytes: 1024 },
    });

    const { status, report } = reportFor(root);
    expect(status).toBe(1);
    expect(checkIn(report, 'cssBytes')).toEqual({
      id: 'cssBytes',
      label: 'CSS',
      actual: CSS.length,
      limit: 1024,
      ok: false,
    });
  });

  it('fails closed when a required budget is absent', () => {
    const { fontBytes: _omitted, ...budget } = GENEROUS_BUDGET;
    const { root } = createFixture({ budget });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('missing required budget(s): fontBytes');
    expect(output).not.toContain('budget(s) within limits');
  });

  it('rejects an unknown budget key rather than silently ignoring it', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssByte: 1024 },
    });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('unknown budget(s): cssByte');
  });

  it.each([
    ['a string', '"large"'],
    ['null', 'null'],
    ['an array', '[]'],
  ])('rejects %s as the budget root', (_description, contents) => {
    const { root } = createFixture();
    write(root, 'scripts/budget.json', contents);

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('must be a JSON object');
  });

  it.each([
    ['a string', '"1000"'],
    ['null', 'null'],
    ['zero', '0'],
    ['a negative number', '-1'],
    ['a fraction', '1.5'],
    ['an infinite JSON number', '1e999'],
  ])('rejects %s as a budget value', (_description, value) => {
    const { root } = createFixture();
    const budget = JSON.stringify(GENEROUS_BUDGET).replace(
      '"fontBytes":1000000',
      `"fontBytes":${value}`,
    );
    write(root, 'scripts/budget.json', budget);

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('invalid budget(s): fontBytes is');
    expect(output).toContain('positive whole number of bytes');
  });

  it('requires a committed budget file', () => {
    const { root } = createFixture({ budget: null });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('scripts/budget.json is missing');
  });

  it.each([
    ['an empty object', '{}'],
    ['only policy notes', '{"_policy":["fixture"]}'],
    ['no file', null],
  ])('bootstraps the complete budget from %s', (_description, contents) => {
    const { root } = createFixture({ budget: null });
    if (contents !== null) write(root, 'scripts/budget.json', contents);

    const { status, output } = runMeasurer(root, ['--update-budget']);
    expect(status).toBe(0);
    expect(output).toContain('ratcheted scripts/budget.json');

    const budget = JSON.parse(
      readFileSync(join(root, 'scripts/budget.json'), 'utf8'),
    );
    expect(Object.keys(budget)).toEqual([
      '_policy',
      'totalBytes',
      'javascriptBytes',
      'cssBytes',
      'fontBytes',
      'maxFileBytes',
      'maxRouteBootstrapBytes',
      'repeatedInlineSvgBytes',
    ]);
    expect(runMeasurer(root).status).toBe(0);
  });

  it('ratchets the budget with documented headroom and keeps the policy', () => {
    const { root, documents } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssBytes: 1024 },
    });

    const { status, output } = runMeasurer(root, ['--update-budget']);
    expect(status).toBe(0);
    expect(output).toContain('ratcheted scripts/budget.json');

    const budget = JSON.parse(
      readFileSync(join(root, 'scripts/budget.json'), 'utf8'),
    );
    expect(budget._policy).toEqual(['fixture']);
    // 15% headroom rounded up to the next KiB: 4096 -> 4710.4 -> 5120.
    expect(budget.cssBytes).toBe(5120);
    // 15% on the heaviest bootstrap set, same rounding.
    const heaviest =
      Math.max(documents['/'], documents['/about/']) + LINKED_ASSET_BYTES;
    expect(budget.maxRouteBootstrapBytes).toBe(
      Math.ceil((heaviest * 1.15) / 1024) * 1024,
    );
  });

  it('fails when there is nothing to measure', () => {
    const { root } = createFixture();
    rmSync(join(root, 'out'), { recursive: true, force: true });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('no files found in out/');
  });

  it.each([['--json='], ['--json', '']])(
    'rejects an empty JSON destination',
    (...args) => {
      const { status, output } = runMeasurer(
        createFixture().root,
        args as string[],
      );
      expect(status).toBe(1);
      expect(output).toContain('--json needs a file path (use `-` for stdout)');
    },
  );

  it('keeps stdout machine-readable when JSON is written there', () => {
    const { status, stdout, stderr } = runMeasurer(createFixture().root, [
      '--json',
      '-',
    ]);

    expect(status).toBe(0);
    expect(JSON.parse(stdout).total.files).toBe(11);
    expect(stdout).not.toContain('by subsystem');
    expect(stderr).toContain('by subsystem');
    expect(stderr).toContain('7 budget(s) within limits');
  });

  it('runs the documented npm command through a JSON consumer', () => {
    expect(readFileSync(measurer, 'utf8')).toContain(DOCUMENTED_JSON_COMMAND);
    const { root } = createFixture();
    const { status, stdout, stderr } = runPipeline(
      root,
      `${DOCUMENTED_JSON_COMMAND} | "${process.execPath}" parse-stdin.mjs`,
    );

    expect(status).toBe(0);
    expect(stdout).toBe('11');
    expect(stderr).toContain('by subsystem');
  });
});
