#!/usr/bin/env node
/**
 * Post-build gate over the static export in `out/`.
 *
 * The deploy workflow previously accepted any build in which `out/` merely
 * existed, which is how a `draft: true` post once shipped publicly indexable.
 * These are the failures that were real, cheap to detect, and invisible to the
 * unit tests — they all live in generated HTML rather than in a component.
 *
 * Run with `npm run verify-export` after `npm run build`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';

const OUT = resolve(process.cwd(), 'out');
const CONTENT = resolve(process.cwd(), 'content/writing');

const failures = [];
const fail = (page, message) => failures.push({ page, message });

function walk(dir, match) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      found.push(...walk(path, match));
    } else if (match(entry)) {
      found.push(path);
    }
  }
  return found;
}

const pages = walk(OUT, (name) => name.endsWith('.html'));
if (pages.length === 0) {
  console.error('verify-export: no HTML found in out/. Did the build run?');
  process.exit(1);
}

const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

/** URLs always use forward slashes; `relative` uses the platform separator. */
const toUrlPath = (p) => p.split(sep).join('/');

/** Slugs marked `draft: true` must not appear in the export at all. */
const draftSlugs = walk(CONTENT, (name) => name.endsWith('.md'))
  .filter((path) => /^draft:\s*true\s*$/m.test(readFileSync(path, 'utf8')))
  .map((path) => basename(path, '.md'));

const exportedPaths = new Set(
  pages.map(
    (p) => `/${toUrlPath(relative(OUT, p)).replace(/index\.html$/, '')}`,
  ),
);

for (const page of pages) {
  const rel = toUrlPath(relative(OUT, page));
  const html = readFileSync(page, 'utf8');

  // A draft must not be exported under any route.
  for (const slug of draftSlugs) {
    if (rel.includes(slug)) {
      fail(rel, `exports draft post "${slug}"`);
    }
  }

  // Contradictory robots directives let a crawler pick either reading.
  // Directives are split rather than substring-matched, because "noindex"
  // trivially contains "index".
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/g);
  const directives = robots.flatMap((r) =>
    r.split(',').map((d) => d.trim().toLowerCase()),
  );
  if (robots.length > 1) {
    fail(rel, `${robots.length} robots tags: ${robots.join(' | ')}`);
  }
  if (directives.includes('noindex') && directives.includes('index')) {
    fail(rel, `robots says both noindex and index: ${robots.join(' | ')}`);
  }

  // Duplicate ids make fragment links ambiguous and are invalid HTML.
  const ids = attr(html, /\sid="([^"]+)"/g);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dupes.length > 0) {
    fail(rel, `duplicate ids: ${dupes.join(', ')}`);
  }

  // A canonical must point at a route that actually exists.
  const [canonical] = attr(html, /<link rel="canonical" href="([^"]+)"/g);
  if (canonical) {
    const path = canonical.replace(/^https?:\/\/[^/]+/, '');
    if (!exportedPaths.has(path) && !exportedPaths.has(`${path}/`)) {
      fail(rel, `canonical points at missing route: ${path}`);
    }
  }

  // Every indexable page needs a share image, and that file must exist.
  const isIndexable = !directives.includes('noindex');
  const [ogImage] = attr(html, /<meta property="og:image" content="([^"]+)"/g);
  if (isIndexable && !ogImage) {
    fail(rel, 'no og:image');
  }
  if (ogImage) {
    const imagePath = ogImage.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    try {
      statSync(join(OUT, imagePath));
    } catch {
      fail(rel, `og:image file missing from export: ${imagePath}`);
    }
  }

  // Internal links must resolve to something in the export.
  for (const href of attr(html, /<a[^>]+href="(\/[^"#?]*)"/g)) {
    const target = href.endsWith('/') ? href : `${href}/`;
    const isFile = /\.[a-z0-9]+$/i.test(href);
    const exists = isFile
      ? (() => {
          try {
            statSync(join(OUT, href));
            return true;
          } catch {
            return false;
          }
        })()
      : exportedPaths.has(target);
    if (!exists) {
      fail(rel, `internal link to missing route: ${href}`);
    }
  }

  if (isIndexable && !/<title>/.test(html)) {
    fail(rel, 'no <title>');
  }
}

if (failures.length > 0) {
  console.error(`\nverify-export: ${failures.length} problem(s)\n`);
  for (const { page, message } of failures) {
    console.error(`  ${page}\n    ${message}`);
  }
  process.exit(1);
}

console.log(
  `verify-export: ${pages.length} pages OK ` +
    `(drafts, robots, duplicate ids, canonicals, share images, internal links)`,
);
