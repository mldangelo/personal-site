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

/**
 * The exact command the script's header advertises as machine-readable, run here
 * as written. `--silent` is npm's own flag, so it sits before the `--`; without
 * it npm prints its two-line script banner to stdout ahead of the JSON and any
 * consumer parsing the stream fails on the first line.
 */
const DOCUMENTED_JSON_COMMAND = 'npm run measure-export --silent -- --json -';

/**
 * Stands in for `jq empty` without depending on jq: reads the whole stream and
 * exits non-zero unless it parses. Written into the fixture as a file so the
 * shell in the pipeline has nothing to quote.
 */
const PARSE_STDIN = `let text = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  text += chunk;
});
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

const ASSET_BYTES = CSS.length + JS.length + FONT.length;

/** Everything a known budget key can hold that is not a byte count. */
const INVALID_BUDGET_VALUES: [shape: string, value: unknown][] = [
  ['a string', '1024'],
  ['null', null],
  ['a boolean', true],
  ['an object', { bytes: 1024 }],
  ['a negative number', -1],
  ['a fraction', 1024.5],
];

/** Generous enough that only the budget under test can trip. */
const GENEROUS_BUDGET = {
  _policy: ['fixture'],
  totalBytes: 10_000_000,
  javascriptBytes: 1_000_000,
  cssBytes: 1_000_000,
  fontBytes: 1_000_000,
  maxFileBytes: 1_000_000,
  maxRouteFirstLoadBytes: 1_000_000,
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
    assetBytes: number;
    firstLoadBytes: number;
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
  <body>${body}${ICON}</body>
</html>`;
}

function createFixture({
  basePath = '',
  budget = GENEROUS_BUDGET as Record<string, unknown> | null,
} = {}) {
  const root = mkdtempSync(join(tmpdir(), 'measure-export-'));
  fixtureRoots.push(root);

  // `scripts` is what makes `npm run measure-export` reachable from the fixture,
  // so the documented npm command can be exercised rather than approximated by
  // spawning node directly — which is how the banner on stdout went unnoticed.
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
  // A real checkout always has `scripts/` — the measurer lives in it — so a
  // fixture with no budget file still needs the directory, or `--update-budget`
  // has nowhere to write and the bootstrap looks broken for the wrong reason.
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

/**
 * Runs a shell pipeline in the fixture, so the reported status is the consumer's
 * — exactly what a person's shell reports for `… | jq empty`.
 */
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

  it('charges each route for the assets its document pulls', () => {
    const { root, documents } = createFixture();
    const { report } = reportFor(root);

    // The stylesheet, the font, and the chunk, counted once even though the
    // chunk is both preloaded and executed.
    expect(routeIn(report, '/about/')).toEqual({
      route: '/about/',
      documentBytes: documents['/about/'],
      assetBytes: ASSET_BYTES,
      firstLoadBytes: documents['/about/'] + ASSET_BYTES,
    });
  });

  it('resolves first-load assets through a repository-site base path', () => {
    const { root } = createFixture({ basePath: '/personal-site' });
    const { status, report } = reportFor(root);

    expect(status).toBe(0);
    expect(report.basePath).toBe('/personal-site');
    // Markup says /personal-site/_next/..., the file is at out/_next/...; a
    // hand-rolled prefix strip resolves nothing and reports 0 asset bytes.
    expect(routeIn(report, '/about/')?.assetBytes).toBe(ASSET_BYTES);
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

  it('leaves a metric ungated when its budget is absent', () => {
    const { fontBytes: _omitted, ...budget } = GENEROUS_BUDGET;
    const { root } = createFixture({ budget });

    const { status, output, report } = reportFor(root);
    expect(status).toBe(0);
    expect(output).toContain('6 budget(s) within limits');
    expect(checkIn(report, 'fontBytes')).toMatchObject({
      actual: FONT.length,
      limit: null,
      ok: true,
    });
  });

  it('names a metric it is measuring but not gating', () => {
    const { fontBytes: _omitted, ...budget } = GENEROUS_BUDGET;
    const { root } = createFixture({ budget });

    const { status, stdout, stderr } = runMeasurer(root, ['--json', '-']);
    expect(status).toBe(0);
    expect(stderr).toContain('1 metric(s) measured but not gated: fontBytes');
    // A warning on the machine-readable stream would be the other bug.
    expect(() => JSON.parse(stdout)).not.toThrow();
  });

  it('says nothing about ungated metrics when all seven are budgeted', () => {
    const { output } = runMeasurer(createFixture().root);

    expect(output).not.toContain('not gated');
  });

  // `{}` and `{"_policy": []}` satisfied every other rule in this file, then
  // gave all seven metrics an undefined limit and reported
  // `0 budget(s) within limits` with status 0 — the silent no-gates failure the
  // root and value checks exist to prevent, one level up.
  it.each([
    ['an empty object', '{}'],
    ['nothing but comment keys', '{"_policy": ["notes"]}'],
  ])(
    'refuses to gate nothing when the budget file is %s',
    (_shape, contents) => {
      const { root } = createFixture();
      write(root, 'scripts/budget.json', contents);

      const { status, output } = runMeasurer(root);
      expect(status).toBe(1);
      expect(output).toContain('scripts/budget.json declares no budgets');
      expect(output).toContain('totalBytes');
      expect(output).not.toContain('budget(s) within limits');
    },
  );

  // The gate above is only tolerable because the bootstrap path stays open, and
  // only useful because the bootstrap closes it: `--update-budget` writes every
  // known metric, so a file it produced can never be the empty one.
  it.each([
    ['an empty object', '{}'],
    ['nothing but comment keys', '{"_policy": ["notes"]}'],
    ['no file at all', null],
  ])('bootstraps a budget from %s with --update-budget', (_shape, contents) => {
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
      'maxRouteFirstLoadBytes',
      'repeatedInlineSvgBytes',
    ]);
    // Which is exactly what the run it just unblocked requires.
    expect(runMeasurer(root).status).toBe(0);
  });

  it('rejects an unknown budget key rather than silently ignoring it', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssByte: 1024 },
    });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('unknown budget(s): cssByte');
  });

  // A known key holding something that is not a byte count used to be read as
  // "no budget for this metric", so the gate quietly stopped gating.
  it.each(INVALID_BUDGET_VALUES)(
    'rejects a budget committed as %s',
    (_shape, value) => {
      const { root } = createFixture({
        budget: { ...GENEROUS_BUDGET, cssBytes: value },
      });

      const { status, output } = runMeasurer(root);
      expect(status).toBe(1);
      expect(output).toContain('invalid budget(s): cssBytes');
      expect(output).not.toContain('budget(s) within limits');
    },
  );

  it('names every invalid budget, not just the first', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssBytes: null, fontBytes: '1024' },
    });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain(
      'invalid budget(s): cssBytes is null, fontBytes is "1024"',
    );
  });

  it('rejects a budget that overflowed to Infinity', () => {
    const { root } = createFixture();
    // JSON has no Infinity literal, but `1e999` parses to one — and it is the
    // worst of these, because it counts as a gated metric that can never be
    // exceeded, so the run reports a budget it is not enforcing.
    write(root, 'scripts/budget.json', '{"_policy": [], "cssBytes": 1e999}');

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('invalid budget(s): cssBytes is Infinity');
  });

  it('treats a zero budget as a real limit rather than an invalid one', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, repeatedInlineSvgBytes: 0 },
    });

    // `0` is the one edge of the rule that has to stay usable: it is how a
    // metric is held at nothing.
    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).not.toContain('invalid budget(s)');
    expect(output).toContain(
      'inline SVG repeated across documents (repeatedInlineSvgBytes)',
    );
  });

  it.each(['42', '"1024"', '[1, 2]', 'null'])(
    'rejects a budget file whose root is %s',
    (contents) => {
      const { root } = createFixture();
      write(root, 'scripts/budget.json', contents);

      // `42` is valid JSON declaring no budgets at all, so it used to gate
      // nothing and exit 0; `null` took `Object.keys` down with a stack trace.
      const { status, output } = runMeasurer(root);
      expect(status).toBe(1);
      expect(output).toContain(
        'scripts/budget.json must be a JSON object mapping budget names to bytes',
      );
      expect(output).not.toContain('budget(s) within limits');
    },
  );

  it('requires a committed budget file', () => {
    const { root } = createFixture({ budget: null });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('scripts/budget.json is missing');
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
    // 15% on the heaviest first load, same rounding.
    const heaviest =
      Math.max(documents['/'], documents['/about/']) + ASSET_BYTES;
    expect(budget.maxRouteFirstLoadBytes).toBe(
      Math.ceil((heaviest * 1.15) / 1024) * 1024,
    );
  });

  // `--json -` is documented as machine-readable output. The table used to be
  // printed to stdout ahead of it, so nothing could parse the stream.
  it.each<[flag: string, args: string[]]>([
    ['--json -', ['--json', '-']],
    ['--json=-', ['--json=-']],
  ])('writes only JSON to stdout for `%s`', (_flag, args) => {
    const { root, documents } = createFixture();
    const { status, stdout, stderr } = runMeasurer(root, args);

    expect(status).toBe(0);
    const report = JSON.parse(stdout) as Report;
    expect(report.total.files).toBe(11);
    expect(routeIn(report, '/about/')?.documentBytes).toBe(
      documents['/about/'],
    );

    // Suppressed nowhere: the human narrative moves to stderr, so
    // `--json - >report.json` still shows the table in the terminal.
    expect(stdout).not.toContain('by subsystem');
    expect(stderr).toContain('by subsystem');
    expect(stderr).toContain('7 budget(s) within limits');
  });

  it('advertises the machine-readable command this suite runs', () => {
    // Header and test cannot drift: the string below is the one being run.
    expect(readFileSync(measurer, 'utf8')).toContain(DOCUMENTED_JSON_COMMAND);
  });

  // Spawning `node` directly parses whatever this script writes and says nothing
  // about the command people are told to run. `npm run measure-export -- --json -`
  // prints npm's two-line script banner to stdout ahead of the JSON, so piping
  // the documented command to `jq empty` exited 5 and the producer got EPIPE.
  it('parses when the documented npm command is piped to a consumer', () => {
    const { root } = createFixture();
    const { status, stdout, stderr } = runPipeline(
      root,
      `${DOCUMENTED_JSON_COMMAND} | "${process.execPath}" parse-stdin.mjs`,
    );

    expect(status).toBe(0);
    // The consumer echoes the file count it parsed out of the stream.
    expect(stdout).toBe('11');
    expect(stderr).toContain('by subsystem');
  });

  it('exits quietly when the consumer stops reading', () => {
    const { root } = createFixture();

    // `true` is the deterministic stand-in for a consumer that already has what
    // it came for — `head` past its last line, `jq .total` past its field. A
    // literal `head -1` only trips this once the report outgrows the pipe
    // buffer, which is how an unhandled EPIPE stack trace sat here unnoticed.
    const { status, stderr } = runPipeline(
      root,
      `"${process.execPath}" "${measurer}" --json - | true`,
    );

    expect(status).toBe(0);
    expect(stderr).not.toContain('EPIPE');
    // Quietly, not silently: the human narrative on stderr still lands.
    expect(stderr).toContain('7 budget(s) within limits');
  });

  it('keeps stdout parseable when a budget fails', () => {
    const { root } = createFixture({
      budget: { ...GENEROUS_BUDGET, cssBytes: 1024 },
    });

    const { status, stdout, stderr } = runMeasurer(root, ['--json', '-']);
    expect(status).toBe(1);
    expect(checkIn(JSON.parse(stdout) as Report, 'cssBytes')).toMatchObject({
      limit: 1024,
      ok: false,
    });
    expect(stderr).toContain('1 budget(s) exceeded');
  });

  it('still prints the table to stdout when the report goes to a file', () => {
    const { root } = createFixture();

    // The redirect is for `-` only; a person running `--json report.json`
    // wants both.
    const { status, stdout } = runMeasurer(root, ['--json', 'report.json']);
    expect(status).toBe(0);
    expect(stdout).toContain('by subsystem');
    expect(stdout).toContain('wrote report.json');
    expect(stdout).toContain('7 budget(s) within limits');
  });

  it('fails when there is nothing to measure', () => {
    const { root } = createFixture();
    rmSync(join(root, 'out'), { recursive: true, force: true });

    const { status, output } = runMeasurer(root);
    expect(status).toBe(1);
    expect(output).toContain('no files found in out/');
  });
});
