#!/usr/bin/env node
/**
 * Post-build integrity gate for the static export in `out/`.
 *
 * This intentionally inspects the generated artifacts rather than React
 * components. Metadata inheritance, draft filtering, route generation, and
 * static asset copying can all be correct in source and still fail in the
 * exported site.
 *
 * Run with `npm run verify-export` after `npm run build`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import matter from 'gray-matter';

import { validatePostFrontmatterData } from '../src/lib/post-frontmatter.mjs';
import {
  attribute,
  canonicalValues,
  decodeHtml,
  metaValues,
  tags,
} from './lib/html.mjs';
import { declaredAssetRoutes, draftOnlyAssetRoutes } from './lib/markdown.mjs';
import { exportLayout, readSiteConfig, toUrlPath } from './lib/site.mjs';
import { POST_CARD_DIRECTORY } from './og-inputs.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'out');
const CONTENT = resolve(ROOT, 'content/writing');

const failures = [];
const fail = (page, message) => failures.push({ page, message });

function walk(dir, match) {
  const found = [];
  if (!existsSync(dir)) return found;

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

const {
  origin: SITE_ORIGIN,
  basePath: SITE_BASE_PATH,
  exportFileFor,
  publicPathForRoute,
  routeForHtml,
  routeForPublicPath,
  siteUrlForRoute,
} = exportLayout({
  outDir: OUT,
  ...readSiteConfig(ROOT, 'verify-export'),
});

const pages = walk(OUT, (name) => name.endsWith('.html'));

if (pages.length === 0) {
  console.error('verify-export: no HTML found in out/. Did the build run?');
  process.exit(1);
}

const posts = walk(CONTENT, (name) => name.endsWith('.md')).map((path) => {
  // Use the same YAML parser as the application. A line regex misses valid
  // forms such as `draft: true # keep private`, weakening the fault-injection
  // gate precisely when the route layer regresses. Validation is shared with
  // the route and share-card readers so malformed frontmatter cannot pass one
  // publication boundary and fail another.
  const { data, content } = matter(readFileSync(path, 'utf8'));
  const source = relative(ROOT, path);
  const frontmatter = validatePostFrontmatterData(data, source);

  return {
    slug: basename(path, '.md'),
    isDraft: frontmatter.draft === true,
    assets: declaredAssetRoutes({ data, content }),
  };
});

const draftSlugs = posts
  .filter((post) => post.isDraft)
  .map((post) => post.slug);

function isDraftPath(pathname) {
  const route = routeForPublicPath(pathname) ?? pathname;
  return draftSlugs.some(
    (slug) =>
      route === `/writing/${slug}` || route.startsWith(`/writing/${slug}/`),
  );
}

/**
 * Where in the export a file *named after* a post can appear.
 *
 * `POST_CARD_DIRECTORY` is the generated share cards, taken from the generator's
 * own constant so moving them cannot silently un-scope this gate. `/writing` is
 * the posts' own route tree, which carries more than HTML: Next writes an RSC
 * prefetch payload beside every prerendered route, so a leaked draft route also
 * ships an `index.txt` that no metadata check reads. `/images/writing` is where
 * article images live.
 *
 * Scoping is what keeps a slug rule honest: the scan used to match any path
 * segment anywhere in `out/`, which meant a draft slug colliding with an
 * unrelated committed file (`notes.md` against `public/images/notes.png`) failed
 * the whole build with a draft-leak message pointing at a file nothing
 * generated. The cost is that a name this list does not cover is invisible here
 * — which is not the same as unwatched, because the reference scan below reads
 * the post's own declaration and does not care about names at all. Register a
 * new directory that holds *generated* per-post files anyway; the Markdown
 * cannot reference what the build invents.
 */
const POST_ASSET_ROOTS = [POST_CARD_DIRECTORY, '/writing', '/images/writing'];

/**
 * A route under one of those directories that belongs to a draft.
 *
 * The slug has to be a whole path component: `<root>/<slug>` itself, anything
 * beneath it, or a sibling file named for it (`<root>/<slug>.png`). A prefix
 * match alone would also catch `<root>/<slug>-part-two.png`, which is a
 * different post.
 */
function isDraftAsset(route) {
  return POST_ASSET_ROOTS.some((root) =>
    draftSlugs.some(
      (slug) =>
        route === `${root}/${slug}` ||
        route.startsWith(`${root}/${slug}/`) ||
        route.startsWith(`${root}/${slug}.`),
    ),
  );
}

/**
 * Nothing belonging to a draft may reach the export, not only routes.
 *
 * The route and metadata checks below see HTML and XML. `public/` is copied
 * into the export verbatim, so anything belonging to an unpublished post — a
 * per-post share card, an author's screenshots — reaches the site as a plain
 * file that no metadata gate looks at, carrying unpublished work in its name
 * and its pixels. HTML is skipped here only because `isDraftPath` already
 * covers every route.
 */
if (draftSlugs.length > 0) {
  for (const file of walk(OUT, (name) => !name.endsWith('.html'))) {
    const path = toUrlPath(relative(OUT, file));

    // `out/` is the site root; the repository-site base path is not on disk, so
    // an out-relative path is already a route.
    if (isDraftAsset(`/${path}`)) {
      fail(path, `exports an asset named after a draft post: /${path}`);
    }
  }
}

/**
 * Files a draft declares as its own, wherever they were filed.
 *
 * This is the half of the draft-asset gate that does not go through names. The
 * live example is `public/images/writing/codex-desktop-app-post/`, three
 * screenshots for a `draft: true` post in a directory whose name appears in no
 * slug — publicly fetchable, and invisible to every other check here.
 */
for (const [route, slug] of draftOnlyAssetRoutes(posts)) {
  // Already fatal above, and one file deserves one report.
  if (isDraftAsset(route)) continue;
  if (!exportedFileExists(publicPathForRoute(route))) continue;

  fail(
    route.replace(/^\//, ''),
    `draft post "${slug}" references this file, so it is publicly fetchable at ` +
      `${siteUrlForRoute(route)}. Move it out of public/ until the post ships, ` +
      'or publish the post in the same change.',
  );
}

const records = pages.map((file) => {
  const relativePath = toUrlPath(relative(OUT, file));
  const html = readFileSync(file, 'utf8');
  const robots = metaValues(html, 'name', 'robots');
  const directives = robots.flatMap((content) =>
    content.split(',').map((directive) => directive.trim().toLowerCase()),
  );
  const ids = tags(html)
    .map((tag) => attribute(tag, 'id'))
    .filter((id) => id !== undefined);

  return {
    file,
    relativePath,
    route: routeForHtml(relativePath),
    html,
    robots,
    directives,
    ids,
    isIndexable: !directives.includes('noindex'),
  };
});

const recordsByRoute = new Map(records.map((record) => [record.route, record]));

function pageAt(pathname) {
  const route = routeForPublicPath(pathname);
  if (route === undefined) return undefined;

  return (
    recordsByRoute.get(route) ??
    (!route.endsWith('/') ? recordsByRoute.get(`${route}/`) : undefined)
  );
}

function exportedFileExists(pathname) {
  return exportFileFor(pathname) !== undefined;
}

function parseHttpUrl(raw, baseRoute, page, label) {
  let url;
  try {
    url = new URL(raw, siteUrlForRoute(baseRoute));
  } catch {
    fail(page, `${label} is not a valid URL: ${raw}`);
    return undefined;
  }

  if (!['http:', 'https:'].includes(url.protocol)) return undefined;
  return url;
}

function hasCanonicalPathFormat(raw, url) {
  if (url.search || url.hash) return false;
  if (raw !== url.href) return false;
  return (
    url.pathname === '/' ||
    url.pathname.endsWith('/') ||
    extname(url.pathname) !== ''
  );
}

function validateInternalTarget(raw, source, label) {
  const url = parseHttpUrl(raw, source.route, source.relativePath, label);
  if (!url || url.origin !== SITE_ORIGIN) return;

  if (routeForPublicPath(url.pathname) === undefined) {
    fail(
      source.relativePath,
      `${label} points outside configured base path ${SITE_BASE_PATH}/: ${raw}`,
    );
    return;
  }

  if (isDraftPath(url.pathname)) {
    fail(
      source.relativePath,
      `${label} exposes a draft route: ${url.pathname}`,
    );
  }

  const targetPage = pageAt(url.pathname);
  const targetExists = targetPage || exportedFileExists(url.pathname);
  if (!targetExists) {
    fail(source.relativePath, `${label} points at missing export: ${raw}`);
    return;
  }

  const fragment = url.hash.slice(1);
  if (!fragment || fragment.startsWith(':~:text=') || !targetPage) return;

  let decodedFragment;
  try {
    decodedFragment = decodeURIComponent(fragment);
  } catch {
    fail(source.relativePath, `${label} has an invalid fragment: ${url.hash}`);
    return;
  }

  if (!targetPage.ids.includes(decodedFragment)) {
    fail(
      source.relativePath,
      `${label} points at missing fragment: ${url.pathname}#${fragment}`,
    );
  }
}

function validateAbsoluteMetadataUrl(raw, source, label) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail(source.relativePath, `${label} is not an absolute URL: ${raw}`);
    return undefined;
  }

  if (url.origin !== SITE_ORIGIN) {
    fail(
      source.relativePath,
      `${label} uses ${url.origin}; expected ${SITE_ORIGIN}`,
    );
  }
  if (routeForPublicPath(url.pathname) === undefined) {
    fail(
      source.relativePath,
      `${label} points outside configured base path ${SITE_BASE_PATH}/: ${raw}`,
    );
  }
  if (!hasCanonicalPathFormat(raw, url)) {
    fail(
      source.relativePath,
      `${label} must have no query/hash and use the canonical trailing-slash form: ${raw}`,
    );
  }
  if (isDraftPath(url.pathname)) {
    fail(
      source.relativePath,
      `${label} exposes a draft route: ${url.pathname}`,
    );
  }

  return url;
}

const REQUIRED_SOCIAL_META = [
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:site_name'],
  ['property', 'og:locale'],
  ['property', 'og:type'],
  ['property', 'og:image'],
  ['property', 'og:image:alt'],
  ['name', 'twitter:card'],
  ['name', 'twitter:site'],
  ['name', 'twitter:creator'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
];

for (const record of records) {
  const { directives, html, ids, isIndexable, relativePath, robots, route } =
    record;

  if (isDraftPath(route)) {
    fail(relativePath, `exports draft route: ${route}`);
  }

  if (robots.length > 1) {
    fail(relativePath, `${robots.length} robots tags: ${robots.join(' | ')}`);
  }
  if (directives.includes('noindex') && directives.includes('index')) {
    fail(
      relativePath,
      `robots says both noindex and index: ${robots.join(' | ')}`,
    );
  }

  if (isIndexable) {
    for (const [key, name] of REQUIRED_SOCIAL_META) {
      const values = metaValues(html, key, name);
      if (values.length !== 1) {
        fail(
          relativePath,
          `indexable page has ${values.length} ${name} tags; expected 1`,
        );
      } else if (!values[0].trim()) {
        fail(relativePath, `${name} must not be empty`);
      }
    }
  }

  const duplicateIds = [
    ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
  ];
  if (duplicateIds.length > 0) {
    fail(relativePath, `duplicate ids: ${duplicateIds.join(', ')}`);
  }

  const canonicals = canonicalValues(html);
  if (isIndexable && canonicals.length !== 1) {
    fail(
      relativePath,
      `indexable page has ${canonicals.length} canonical links; expected 1`,
    );
  } else if (!isIndexable && canonicals.length > 1) {
    fail(
      relativePath,
      `non-indexable page has ${canonicals.length} canonical links; expected at most 1`,
    );
  }

  const canonicalUrl = canonicals[0]
    ? validateAbsoluteMetadataUrl(canonicals[0], record, 'canonical')
    : undefined;
  if (
    isIndexable &&
    canonicalUrl &&
    routeForPublicPath(canonicalUrl.pathname) !== route
  ) {
    fail(
      relativePath,
      `canonical path ${canonicalUrl.pathname} does not match exported route ${publicPathForRoute(route)}`,
    );
  }
  if (
    canonicalUrl &&
    !pageAt(canonicalUrl.pathname) &&
    !exportedFileExists(canonicalUrl.pathname)
  ) {
    fail(
      relativePath,
      `canonical points at missing export: ${canonicalUrl.pathname}`,
    );
  }

  const ogUrls = metaValues(html, 'property', 'og:url');
  if (isIndexable && ogUrls.length !== 1) {
    fail(
      relativePath,
      `indexable page has ${ogUrls.length} og:url tags; expected 1`,
    );
  } else if (!isIndexable && ogUrls.length > 1) {
    fail(
      relativePath,
      `non-indexable page has ${ogUrls.length} og:url tags; expected at most 1`,
    );
  }

  const ogUrl = ogUrls[0]
    ? validateAbsoluteMetadataUrl(ogUrls[0], record, 'og:url')
    : undefined;
  if (canonicalUrl && ogUrl && canonicalUrl.href !== ogUrl.href) {
    fail(
      relativePath,
      `og:url ${ogUrl.href} does not match canonical ${canonicalUrl.href}`,
    );
  }

  const ogImages = metaValues(html, 'property', 'og:image');
  if (isIndexable && ogImages.length !== 1) {
    fail(
      relativePath,
      `indexable page has ${ogImages.length} og:image tags; expected 1`,
    );
  }
  for (const image of ogImages) {
    const imageUrl = parseHttpUrl(image, route, relativePath, 'og:image');
    if (
      imageUrl?.origin === SITE_ORIGIN &&
      !exportedFileExists(imageUrl.pathname)
    ) {
      fail(
        relativePath,
        `og:image file missing from export: ${imageUrl.pathname}`,
      );
    }
  }

  for (const image of metaValues(html, 'name', 'twitter:image')) {
    const imageUrl = parseHttpUrl(image, route, relativePath, 'twitter:image');
    if (
      imageUrl?.origin === SITE_ORIGIN &&
      !exportedFileExists(imageUrl.pathname)
    ) {
      fail(
        relativePath,
        `twitter:image file missing from export: ${imageUrl.pathname}`,
      );
    }
  }

  for (const tag of tags(html, 'a')) {
    const href = attribute(tag, 'href');
    if (href !== undefined) {
      validateInternalTarget(href, record, 'internal link');
    }
  }

  // Checking every local image is deliberately stronger than checking only
  // article images. It catches Markdown typos as well as broken portraits and
  // project thumbnails, with no network dependency.
  for (const tag of tags(html, 'img')) {
    const src = attribute(tag, 'src');
    if (src !== undefined) {
      validateInternalTarget(src, record, 'image');
    }
  }

  if (isIndexable && !tags(html, 'title').length) {
    fail(relativePath, 'no <title>');
  }
}

function validateXmlUrl(raw, documentName, options = {}) {
  let url;
  try {
    url = new URL(decodeHtml(raw.trim()));
  } catch {
    fail(documentName, `invalid absolute URL: ${raw.trim()}`);
    return undefined;
  }

  if (options.requireSiteOrigin && url.origin !== SITE_ORIGIN) {
    fail(
      documentName,
      `URL uses ${url.origin}; expected ${SITE_ORIGIN}: ${raw.trim()}`,
    );
    return url;
  }

  if (url.origin === SITE_ORIGIN) {
    if (routeForPublicPath(url.pathname) === undefined) {
      fail(
        documentName,
        `URL points outside configured base path ${SITE_BASE_PATH}/: ${raw.trim()}`,
      );
      return url;
    }
    if (isDraftPath(url.pathname)) {
      fail(documentName, `exposes draft route: ${url.pathname}`);
    }
    if (!hasCanonicalPathFormat(raw.trim(), url)) {
      fail(
        documentName,
        `URL is not in canonical trailing-slash form: ${raw.trim()}`,
      );
    }
    if (!pageAt(url.pathname) && !exportedFileExists(url.pathname)) {
      fail(documentName, `URL points at missing export: ${url.pathname}`);
    }
  }

  return url;
}

const sitemapPath = join(OUT, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap.xml', 'missing from export');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(
    (match) => decodeHtml(match[1].trim()),
  );

  if (locations.length === 0) {
    fail('sitemap.xml', 'contains no <loc> entries');
  }
  const duplicates = [
    ...new Set(
      locations.filter(
        (location, index) => locations.indexOf(location) !== index,
      ),
    ),
  ];
  if (duplicates.length > 0) {
    fail('sitemap.xml', `duplicate URLs: ${duplicates.join(', ')}`);
  }

  const sitemapRoutes = new Set();
  for (const location of locations) {
    const url = validateXmlUrl(location, 'sitemap.xml', {
      requireSiteOrigin: true,
    });
    if (url) {
      const route = routeForPublicPath(url.pathname);
      if (route !== undefined) sitemapRoutes.add(route);
      const page = pageAt(url.pathname);
      if (page && !page.isIndexable) {
        fail('sitemap.xml', `includes non-indexable route: ${url.pathname}`);
      }
    }
  }

  for (const record of records.filter(({ isIndexable }) => isIndexable)) {
    if (!sitemapRoutes.has(record.route)) {
      fail('sitemap.xml', `omits indexable route: ${record.route}`);
    }
  }
}

const feedPath = join(OUT, 'feed.xml');
if (!existsSync(feedPath)) {
  fail('feed.xml', 'missing from export');
} else {
  const feed = readFileSync(feedPath, 'utf8');
  const textLinks = [...feed.matchAll(/<link>\s*([^<]+?)\s*<\/link>/gi)].map(
    (match) => match[1],
  );
  const guids = [...feed.matchAll(/<guid\b[^>]*>\s*([^<]+?)\s*<\/guid>/gi)].map(
    (match) => match[1],
  );
  const atomLinks = tags(feed, 'atom:link')
    .map((tag) => attribute(tag, 'href'))
    .filter((href) => href !== undefined);

  for (const url of [...textLinks, ...guids, ...atomLinks]) {
    validateXmlUrl(url, 'feed.xml');
  }
}

/** Root properties JSON Resume v1.0.0 allows; the schema forbids the rest. */
const JSON_RESUME_ROOT_KEYS = new Set([
  '$schema',
  'basics',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
  'meta',
]);

/** Every string leaf, with a dotted path, so failures name the field. */
function stringLeaves(value, path = '') {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      stringLeaves(item, `${path}[${index}]`),
    );
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      stringLeaves(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const resumeJsonPath = join(OUT, 'resume.json');
if (!existsSync(resumeJsonPath)) {
  fail('resume.json', 'missing from export');
} else {
  let resume;
  try {
    resume = JSON.parse(readFileSync(resumeJsonPath, 'utf8'));
  } catch (error) {
    fail('resume.json', `is not valid JSON: ${error.message}`);
  }

  if (resume) {
    for (const key of Object.keys(resume)) {
      if (!JSON_RESUME_ROOT_KEYS.has(key)) {
        fail(
          'resume.json',
          `key is not part of the JSON Resume schema: ${key}`,
        );
      }
    }
    if (!resume.basics?.name) fail('resume.json', 'basics.name is missing');
    if (!Array.isArray(resume.work) || resume.work.length === 0) {
      fail('resume.json', 'work is missing or empty');
    }

    const expectedCanonical = siteUrlForRoute('/resume.json');
    if (resume.meta?.canonical !== expectedCanonical) {
      fail(
        'resume.json',
        `meta.canonical is ${resume.meta?.canonical}; expected ${expectedCanonical}`,
      );
    }

    for (const [path, value] of stringLeaves(resume)) {
      if (/^https?:\/\//i.test(value)) {
        validateXmlUrl(value, 'resume.json');
        continue;
      }
      // JSON Resume prose is plain text. The work summaries are Markdown with
      // inline anchors in source, so this is the gate on that conversion.
      if (/<[a-z/][^>]*>/i.test(value) || /\[[^\]]+\]\([^)]*\)/.test(value)) {
        fail('resume.json', `${path} carries markup rather than plain text`);
      }
      if (/\s{2,}|[\n\r\t]/.test(value)) {
        fail('resume.json', `${path} has uncollapsed whitespace`);
      }
    }
  }

  // The artifact is only discoverable if the page still points at it. The
  // internal-link pass proves the target exists; this proves the link is there.
  // `pageAt` takes a public path, which carries the base path on a
  // repository site.
  const resumePage = pageAt(publicPathForRoute('/resume/'));
  if (!resumePage) {
    fail('resume.json', 'no exported /resume/ page to link the artifact');
  } else if (
    !tags(resumePage.html, 'a').some((tag) => {
      const href = attribute(tag, 'href');
      const url = href
        ? parseHttpUrl(
            href,
            resumePage.route,
            resumePage.relativePath,
            'resume JSON link',
          )
        : undefined;
      return url?.href === siteUrlForRoute('/resume.json');
    })
  ) {
    fail(
      'resume.json',
      '/resume/ does not link to the machine-readable resume',
    );
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
  `verify-export: ${pages.length} pages OK (draft routes and assets, robots, ids/fragments, canonicals, complete share metadata, local images, internal links, sitemap/RSS, resume.json)`,
);
