#!/usr/bin/env node
/**
 * Weighs the static export in `out/` and gates it against `scripts/budget.json`.
 *
 * Bundle analysis reports the JavaScript graph. It says nothing about the rest
 * of what GitHub Pages actually serves, which here is mostly not JavaScript:
 * prerendered HTML, the RSC prefetch payloads Next writes beside every route,
 * self-hosted fonts, and images. Those are the parts that grow quietly, so they
 * are the parts worth measuring.
 *
 * Deliberately a script and a CI gate, with no page in the site that displays
 * the result. Writing a manifest into the export changes the export's own size,
 * which makes the on-page version a fixed point needing a second build pass on
 * every leg of the build matrix.
 *
 * Run after `npm run build`:
 *   npm run measure-export                       table plus budget gate
 *   npm run measure-export -- --json report.json also write the raw numbers
 *   npm run measure-export --silent -- --json -  raw numbers on stdout instead
 *   npm run measure-export -- --update-budget    ratchet scripts/budget.json
 *
 * `--silent` on the third line is load-bearing, and it is npm's flag rather than
 * this script's, so it goes before the `--`. Without it npm prints its two-line
 * script banner to stdout ahead of the JSON, so the documented command piped to
 * `jq empty` exits 5 on the banner's first line and this script is handed EPIPE
 * by the consumer that gave up. A dedicated `measure-export:json` script would
 * not help: npm banners whichever script name it is handed, so the silent form
 * is the only npm invocation that is actually machine-readable.
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

import { attribute, elements, tags } from './lib/html.mjs';
import { exportLayout, readSiteConfig, toUrlPath } from './lib/site.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'out');
const BUDGET_PATH = resolve(ROOT, 'scripts/budget.json');

const LABEL = 'measure-export';
const die = (message) => {
  console.error(`${LABEL}: ${message}`);
  process.exit(1);
};

/**
 * A consumer is allowed to stop reading. `--json - | head` and `| jq .total`
 * both close the pipe as soon as they have what they came for, and the write
 * that lands afterwards is not a fault in this script — but Node reports it as
 * an EPIPE `error` event on the stream, which unhandled prints a stack trace
 * over whatever the consumer was doing. Only the JSON write is exposed: the
 * table goes through `console.*`, which swallows write errors itself.
 *
 * Exiting 0 loses the budget verdict, which is the right trade because there is
 * nobody left to read it — the CI gate runs unpiped, so it can never land here.
 */
for (const stream of [process.stdout, process.stderr]) {
  stream.on('error', (error) => {
    if (error.code === 'EPIPE') process.exit(0);
    throw error;
  });
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

function parseArgv(argv) {
  const options = { json: undefined, updateBudget: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--update-budget') {
      options.updateBudget = true;
    } else if (arg === '--json') {
      options.json = argv[index + 1];
      index += 1;
      if (options.json === undefined || options.json.startsWith('--')) {
        die('--json needs a file path (use `-` for stdout)');
      }
    } else if (arg.startsWith('--json=')) {
      options.json = arg.slice('--json='.length);
    } else {
      die(`unknown argument: ${arg}`);
    }
  }

  return options;
}

const options = parseArgv(process.argv.slice(2));

// ---------------------------------------------------------------------------
// Subsystems
// ---------------------------------------------------------------------------

const FONT_EXTENSIONS = new Set(['.woff2', '.woff', '.ttf', '.otf', '.eot']);
const IMAGE_EXTENSIONS = new Set([
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);

/**
 * Next writes an RSC payload beside every prerendered route so client
 * navigation does not refetch the document. They are `.txt`, which `robots.txt`
 * also is, so match the naming Next uses rather than the extension alone.
 */
const isRscPayload = ({ extension, name }) =>
  extension === '.txt' && (name === 'index.txt' || name.startsWith('__next.'));

/** First match wins; the last entry is the catch-all. */
const GROUPS = [
  {
    id: 'documents',
    label: 'HTML documents',
    match: ({ extension }) => extension === '.html',
  },
  { id: 'rsc', label: 'RSC prefetch payloads', match: isRscPayload },
  {
    id: 'javascript',
    label: 'JavaScript',
    match: ({ extension }) => extension === '.js',
  },
  { id: 'css', label: 'CSS', match: ({ extension }) => extension === '.css' },
  {
    id: 'fonts',
    label: 'Fonts',
    match: ({ extension }) => FONT_EXTENSIONS.has(extension),
  },
  {
    id: 'images',
    label: 'Images',
    match: ({ extension }) => IMAGE_EXTENSIONS.has(extension),
  },
  { id: 'metadata', label: 'Feeds and metadata', match: () => true },
];

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

function walkFiles(dir) {
  const found = [];
  if (!existsSync(dir)) return found;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkFiles(path));
    } else if (entry.isFile()) {
      found.push(path);
    }
  }
  return found;
}

const paths = walkFiles(OUT);
if (paths.length === 0) {
  die('no files found in out/. Did the build run?');
}

const site = readSiteConfig(ROOT, LABEL);
const { basePath, exportFileFor, routeForHtml, siteUrlForRoute } = exportLayout(
  {
    outDir: OUT,
    ...site,
  },
);

const files = paths
  .map((path) => {
    const relativePath = toUrlPath(relative(OUT, path));
    const name = relativePath.slice(relativePath.lastIndexOf('/') + 1);
    const descriptor = { extension: extname(name).toLowerCase(), name };
    return {
      path,
      relativePath,
      bytes: statSync(path).size,
      group: GROUPS.find((group) => group.match(descriptor)).id,
    };
  })
  .sort(
    (a, b) => b.bytes - a.bytes || a.relativePath.localeCompare(b.relativePath),
  );

const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);

const groups = GROUPS.map(({ id, label }) => {
  const members = files.filter((file) => file.group === id);
  const bytes = members.reduce((sum, file) => sum + file.bytes, 0);
  return {
    id,
    label,
    files: members.length,
    bytes,
    share:
      totalBytes === 0 ? 0 : Number(((bytes / totalBytes) * 100).toFixed(1)),
  };
}).filter((group) => group.files > 0);

const bytesForGroup = (id) =>
  groups.find((group) => group.id === id)?.bytes ?? 0;

/**
 * What a cold visit to one route downloads: the document plus every exported
 * file it asks for before first paint. Resolving those references is why this
 * shares `exportLayout` with the integrity gate — under a repository-site base
 * path the markup says `/repo/_next/...` while the file is at `out/_next/...`,
 * and a hand-rolled prefix strip is how that breaks in forks only.
 */
const FIRST_LOAD_RELS = new Set(['stylesheet', 'preload', 'modulepreload']);

function referencedFiles(html, route) {
  const references = [
    ...tags(html, 'link')
      .filter((tag) =>
        (attribute(tag, 'rel') ?? '')
          .toLowerCase()
          .split(/\s+/)
          .some((rel) => FIRST_LOAD_RELS.has(rel)),
      )
      .map((tag) => attribute(tag, 'href')),
    ...tags(html, 'script').map((tag) => attribute(tag, 'src')),
  ].filter((reference) => reference !== undefined);

  const resolved = new Set();
  for (const reference of references) {
    let url;
    try {
      url = new URL(reference, siteUrlForRoute(route));
    } catch {
      continue;
    }
    if (url.origin !== site.origin) continue;

    const file = exportFileFor(url.pathname);
    if (file) resolved.add(file);
  }
  return resolved;
}

const bytesByPath = new Map(files.map((file) => [file.path, file.bytes]));

const documents = files.filter((file) => file.group === 'documents');
const inlineSvgCounts = new Map();

const routes = documents
  .map((document) => {
    const route = routeForHtml(document.relativePath);
    const html = readFileSync(document.path, 'utf8');

    for (const svg of elements(html, 'svg')) {
      inlineSvgCounts.set(svg, (inlineSvgCounts.get(svg) ?? 0) + 1);
    }

    let assetBytes = 0;
    for (const file of referencedFiles(html, route)) {
      assetBytes += bytesByPath.get(file) ?? statSync(file).size;
    }

    return {
      route,
      documentBytes: document.bytes,
      assetBytes,
      firstLoadBytes: document.bytes + assetBytes,
    };
  })
  .sort(
    (a, b) =>
      b.firstLoadBytes - a.firstLoadBytes || a.route.localeCompare(b.route),
  );

/**
 * Icon markup is inlined into every document that renders it, so a set of
 * icons in the header or footer is paid for once per page. Count the bytes that
 * a shared sprite would remove: every repeat past the first.
 */
const inlineSvg = [...inlineSvgCounts.entries()].reduce(
  (summary, [markup, count]) => {
    const bytes = Buffer.byteLength(markup);
    summary.bytes += bytes * count;
    summary.distinct += 1;
    summary.repeatedBytes += bytes * (count - 1);
    summary.widestSpread = Math.max(summary.widestSpread, count);
    return summary;
  },
  { bytes: 0, distinct: 0, repeatedBytes: 0, widestSpread: 0 },
);

const report = {
  basePath,
  total: { files: files.length, bytes: totalBytes },
  groups,
  largestFiles: files.slice(0, 12).map(({ relativePath, bytes, group }) => ({
    path: relativePath,
    bytes,
    group,
  })),
  routes,
  inlineSvg,
};

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

/**
 * Headroom is a fraction of the measured value, and it differs on purpose.
 *
 * A budget pinned to the current byte count turns every honest pull request
 * red, so each metric gets room for the change it is expected to absorb before
 * a human has to look. Subsystems that only move when a dependency or the
 * design moves get the least; the total gets enough for content to land.
 */
const BUDGET_METRICS = [
  {
    id: 'totalBytes',
    label: 'total export',
    headroom: 0.2,
    read: (data) => data.total.bytes,
  },
  {
    id: 'javascriptBytes',
    label: 'JavaScript',
    headroom: 0.15,
    read: () => bytesForGroup('javascript'),
  },
  {
    id: 'cssBytes',
    label: 'CSS',
    headroom: 0.15,
    read: () => bytesForGroup('css'),
  },
  {
    id: 'fontBytes',
    label: 'fonts',
    headroom: 0.15,
    read: () => bytesForGroup('fonts'),
  },
  {
    id: 'maxFileBytes',
    label: 'largest single file',
    headroom: 0.2,
    read: (data) => data.largestFiles[0]?.bytes ?? 0,
  },
  {
    id: 'maxRouteFirstLoadBytes',
    label: 'heaviest route first load',
    headroom: 0.15,
    read: (data) => data.routes[0]?.firstLoadBytes ?? 0,
  },
  {
    id: 'repeatedInlineSvgBytes',
    label: 'inline SVG repeated across documents',
    headroom: 0.2,
    read: (data) => data.inlineSvg.repeatedBytes,
  },
];

/** Round up to the next KiB so the committed numbers read as decisions. */
const withHeadroom = ({ headroom }, value) =>
  Math.ceil((value * (1 + headroom)) / 1024) * 1024;

/** Keys documenting the file rather than gating a metric. */
const isCommentKey = (key) => key.startsWith('_');

/**
 * `JSON.stringify` renders Infinity as `null` and would name the wrong mistake,
 * so numbers are described by `String` and everything else as its JSON.
 */
const describeBudget = (value) =>
  typeof value === 'number' ? String(value) : JSON.stringify(value);

function readBudget() {
  if (!existsSync(BUDGET_PATH)) {
    if (options.updateBudget) return {};
    die(
      'scripts/budget.json is missing. Create it with ' +
        '`npm run measure-export -- --update-budget`.',
    );
  }

  let budget;
  try {
    budget = JSON.parse(readFileSync(BUDGET_PATH, 'utf8'));
  } catch (error) {
    die(`scripts/budget.json is not valid JSON: ${error.message}`);
  }

  // A bare number or string is valid JSON that declares no budgets at all, so
  // the run would gate nothing and still exit green; `null` did not even get
  // that far, it took `Object.keys` down with a stack trace.
  if (budget === null || typeof budget !== 'object' || Array.isArray(budget)) {
    die(
      'scripts/budget.json must be a JSON object mapping budget names to ' +
        `bytes, not ${describeBudget(budget)}.`,
    );
  }

  // A typo in a budget key would otherwise read as "this metric is not gated",
  // which is the one failure mode a budget file must not have.
  const known = new Set(BUDGET_METRICS.map(({ id }) => id));
  const unknown = Object.keys(budget).filter(
    (key) => !isCommentKey(key) && !known.has(key),
  );
  if (unknown.length > 0) {
    die(
      `scripts/budget.json has unknown budget(s): ${unknown.join(', ')}. ` +
        `Known budgets: ${[...known].join(', ')}.`,
    );
  }

  // The same failure mode one level down. A budget accidentally committed as a
  // string, or as `null`, used to be read as "no budget" and stopped gating
  // without saying so. Infinity is worse: JSON has no literal for it but
  // `1e999` parses to one, and it counts as a gated metric that can never be
  // exceeded. A negative or fractional byte count gates something, but nothing
  // a person meant, so the whole rule is one predicate.
  const invalid = Object.entries(budget).filter(
    ([key, value]) =>
      !isCommentKey(key) && !(Number.isInteger(value) && value >= 0),
  );
  if (invalid.length > 0) {
    const named = invalid
      .map(([key, value]) => `${key} is ${describeBudget(value)}`)
      .join(', ');
    die(
      `scripts/budget.json has invalid budget(s): ${named}. ` +
        'Every budget must be a whole number of bytes, 0 or greater.',
    );
  }

  // Every rule above rejects a file that would gate the wrong thing. A file that
  // names no metric at all is the same failure with nothing to point at: `{}`
  // and `{"_policy": []}` both satisfy all three checks, then every limit reads
  // as `undefined`, every metric passes, and the run prints
  // `0 budget(s) within limits` and exits 0 — a gate that gates nothing, which
  // is exactly what the root check above says it exists to prevent.
  // `--update-budget` is the one caller allowed to start from nothing, because
  // filling the file in is its whole job.
  const declared = Object.keys(budget).filter((key) => !isCommentKey(key));
  if (declared.length === 0 && !options.updateBudget) {
    die(
      'scripts/budget.json declares no budgets, so this run would gate ' +
        `nothing. It must set at least one of: ${[...known].join(', ')}. ` +
        'Write them with `npm run measure-export -- --update-budget`.',
    );
  }

  return budget;
}

const budget = readBudget();

// `readBudget` has already rejected every value that is not a byte count, so an
// `undefined` limit here means the key is absent, which is the one documented
// way to leave a metric ungated. Coercing here instead is what let a mistyped
// value pass for that.
const checks = BUDGET_METRICS.map((metric) => {
  const actual = metric.read(report);
  return {
    id: metric.id,
    label: metric.label,
    actual,
    limit: budget[metric.id],
    suggested: withHeadroom(metric, actual),
  };
}).map((check) => ({
  ...check,
  ok: check.limit === undefined || check.actual <= check.limit,
}));

report.budget = {
  checks: checks.map(({ id, label, actual, limit, ok }) => ({
    id,
    label,
    actual,
    limit: limit ?? null,
    ok,
  })),
};

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/**
 * `--json -` hands stdout to the machine, so the human narrative moves to
 * stderr rather than being dropped: `--json - >report.json` still prints the
 * table in the terminal, and the budget failures below are already there.
 * Every other invocation keeps the table on stdout where a person reads it.
 */
const jsonToStdout = options.json === '-';
const log = (line) => {
  if (jsonToStdout) console.error(line);
  else console.log(line);
};

const count = (value) => value.toLocaleString('en-US');
const fixed = (value) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
const kib = (value) => fixed(value / 1024);

function table(rows, alignRight) {
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => row[column].length)),
  );
  return rows.map((row) =>
    row
      .map((cell, column) =>
        alignRight.has(column)
          ? cell.padStart(widths[column])
          : cell.padEnd(widths[column]),
      )
      .join('  ')
      .trimEnd(),
  );
}

function section(heading, rows, alignRight) {
  log(`\n  ${heading}`);
  for (const line of table(rows, alignRight)) {
    log(`    ${line}`);
  }
}

log(
  `\n${LABEL}: ${count(files.length)} files, ${count(totalBytes)} bytes ` +
    `(${kib(totalBytes)} KiB) in out/`,
);

section(
  'by subsystem',
  [
    ['subsystem', 'files', 'bytes', 'KiB', 'share'],
    ...groups.map((group) => [
      group.label,
      count(group.files),
      count(group.bytes),
      kib(group.bytes),
      `${fixed(group.share)}%`,
    ]),
    [
      'total',
      count(files.length),
      count(totalBytes),
      kib(totalBytes),
      `${fixed(100)}%`,
    ],
  ],
  new Set([1, 2, 3, 4]),
);

section(
  'largest files',
  [
    ['file', 'bytes'],
    ...report.largestFiles
      .slice(0, 8)
      .map(({ path, bytes }) => [path, count(bytes)]),
  ],
  new Set([1]),
);

section(
  'heaviest first loads (document plus the CSS, JS, and fonts it pulls)',
  [
    ['route', 'document', 'assets', 'first load'],
    ...routes
      .slice(0, 5)
      .map((route) => [
        route.route,
        count(route.documentBytes),
        count(route.assetBytes),
        count(route.firstLoadBytes),
      ]),
  ],
  new Set([1, 2, 3]),
);

log(
  `\n  inline SVG: ${count(inlineSvg.bytes)} bytes across ${count(inlineSvg.distinct)} ` +
    `distinct icons, ${count(inlineSvg.repeatedBytes)} of it repeat ` +
    `(widest spread: ${count(inlineSvg.widestSpread)} documents)`,
);

section(
  'budgets (scripts/budget.json)',
  [
    ['metric', 'actual', 'limit', 'used', ''],
    ...checks.map((check) => [
      check.label,
      count(check.actual),
      check.limit === undefined ? '—' : count(check.limit),
      check.limit === undefined
        ? '—'
        : `${fixed((check.actual / check.limit) * 100)}%`,
      check.ok ? '' : 'OVER',
    ]),
  ],
  new Set([1, 2, 3]),
);

/**
 * Omitting a key is the documented way to leave a metric ungated, so a partial
 * budget is a decision rather than a mistake and does not fail the build. It is
 * still the empty-file failure in miniature: nothing distinguishes "ungated on
 * purpose" from "a metric was added and never budgeted", and `--update-budget`
 * writes all of them, so drift only ever appears by hand. Naming the gaps on
 * stderr — never on the machine-readable stream — makes the decision one a
 * reader has to keep making, without red-lighting a file that is allowed to look
 * like this. Suppressed under `--update-budget`, which is about to close them.
 */
const ungated = checks.filter((check) => check.limit === undefined);
if (ungated.length > 0 && !options.updateBudget) {
  console.error(
    `\n${LABEL}: ${ungated.length} metric(s) measured but not gated: ` +
      `${ungated.map((check) => check.id).join(', ')}. ` +
      'Budget them in scripts/budget.json, or leave them out on purpose.',
  );
}

if (options.json) {
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (jsonToStdout) {
    process.stdout.write(serialized);
  } else {
    writeFileSync(resolve(ROOT, options.json), serialized);
    log(`\n  wrote ${options.json}`);
  }
}

if (options.updateBudget) {
  const next = { _policy: budget._policy ?? [] };
  for (const metric of BUDGET_METRICS) {
    const check = checks.find((candidate) => candidate.id === metric.id);
    next[metric.id] = check.suggested;
  }
  writeFileSync(BUDGET_PATH, `${JSON.stringify(next, null, 2)}\n`);
  log('\n  ratcheted scripts/budget.json to the measured sizes plus headroom');
  process.exit(0);
}

const exceeded = checks.filter((check) => !check.ok);
if (exceeded.length > 0) {
  console.error(`\n${LABEL}: ${exceeded.length} budget(s) exceeded\n`);
  for (const { label, id, actual, limit } of exceeded) {
    const over = actual - limit;
    console.error(
      `  ${label} (${id})\n` +
        `    ${count(actual)} bytes exceeds the ${count(limit)} budget by ` +
        `${count(over)} (${((over / limit) * 100).toFixed(1)}%)`,
    );
  }
  console.error(
    '\n  Bring the number down, or ratchet the budget on purpose with\n' +
      '  `npm run measure-export -- --update-budget` and say why in the pull request.\n',
  );
  process.exit(1);
}

const gated = checks.filter((check) => check.limit !== undefined).length;
log(`\n${LABEL}: ${gated} budget(s) within limits\n`);
