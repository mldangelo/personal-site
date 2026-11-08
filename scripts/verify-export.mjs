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
import { existsSync, readFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { parseFrontmatter } from '../src/lib/frontmatter.mjs';
import {
  parseSrcset,
  readMarkdownReferences,
} from '../src/lib/markdown-assets.mjs';
import { validatePostFrontmatterData } from '../src/lib/post-frontmatter.mjs';
import {
  attribute,
  canonicalValues,
  decodeHtml,
  linkTagsForRel,
  metaValues,
  tags,
} from './lib/html.mjs';
import {
  exportLayout,
  readSiteConfig,
  toUrlPath,
  walkFiles,
} from './lib/site.mjs';
import { POST_CARD_DIRECTORY } from './og-inputs.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'out');
const CONTENT = resolve(ROOT, 'content/writing');

const failures = [];
const fail = (page, message) => failures.push({ page, message });

/** Reports a same-origin URL outside the configured base path; true if it is. */
function isOutsideBasePath(url, page, label, raw) {
  if (routeForPublicPath(url.pathname) !== undefined) return false;
  fail(
    page,
    `${label} points outside configured base path ${SITE_BASE_PATH}/: ${raw}`,
  );
  return true;
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

const pages = walkFiles(OUT).filter((path) => path.endsWith('.html'));

if (pages.length === 0) {
  console.error('verify-export: no HTML found in out/. Did the build run?');
  process.exit(1);
}

const mdFiles = walkFiles(CONTENT).filter((path) => path.endsWith('.md'));
const posts = mdFiles.map((path) => {
  const source = toUrlPath(relative(ROOT, path));
  const { data, content } = parseFrontmatter(readFileSync(path, 'utf8'));
  const frontmatter = validatePostFrontmatterData(data, source);

  return {
    slug: basename(path, '.md'),
    source,
    content,
    frontmatter,
  };
});
const drafts = posts.filter(({ frontmatter }) => frontmatter.draft === true);
const draftSlugs = drafts.map(({ slug }) => slug);

function isDraftPath(pathname) {
  const route = routeForPublicPath(pathname) ?? pathname;
  return draftSlugs.some(
    (slug) =>
      route === `/writing/${slug}` || route.startsWith(`/writing/${slug}/`),
  );
}

/** `out/` holds no base path, so a public path maps to a file path directly. */
const CARD_DIRECTORY = POST_CARD_DIRECTORY.replace(/^\/+/, '');

/**
 * Files the export can only have derived from a draft's Markdown source.
 *
 * The route and metadata checks below see HTML and XML. `public/` is copied
 * into the export verbatim, so anything generated from `content/writing/` — a
 * per-post share card, say — reaches the site as a plain file that no metadata
 * gate looks at, carrying an unpublished title in its name and its pixels.
 *
 * Scoped to the two places a draft slug can only be a draft, rather than to any
 * segment anywhere: post slugs are ordinary words, so a draft called `about`
 * made the site's own `/about/index.html`, `/og.png`, and `/sitemap.xml` fail a
 * clean export. Assets a draft references without naming are the job of the
 * reference walk below, which does not depend on filenames at all.
 */
function isDraftDerivedPath(path) {
  const segments = path.split('/');
  const file = segments.pop();
  const directory = segments.join('/');
  const name = basename(file, extname(file));

  return draftSlugs.some(
    (slug) =>
      // A generated share card: one file per post, named for its slug.
      (directory === CARD_DIRECTORY && name === slug) ||
      // Anything at all exported on the draft's own route.
      (directory === 'writing' && name === slug) ||
      directory === `writing/${slug}` ||
      directory.startsWith(`writing/${slug}/`),
  );
}

if (draftSlugs.length > 0) {
  for (const file of walkFiles(OUT)) {
    const path = toUrlPath(relative(OUT, file));
    // Draft-route HTML is skipped only because `isDraftPath` reports it below,
    // with the route it exposes rather than the file that carries it.
    if (file.endsWith('.html') && isDraftPath(routeForHtml(path))) continue;

    if (isDraftDerivedPath(path)) {
      fail(path, `exports a file named after a draft post: /${path}`);
    }
  }
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

function localExportedResource(raw, baseRoute) {
  let url;
  try {
    url = new URL(raw, siteUrlForRoute(baseRoute));
  } catch {
    return undefined;
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.origin !== SITE_ORIGIN ||
    routeForPublicPath(url.pathname) === undefined ||
    pageAt(url.pathname) ||
    !exportedFileExists(url.pathname)
  ) {
    return undefined;
  }

  return url.pathname;
}

/**
 * Assets already used by an exported page are public independently of a
 * draft. The draft gate below targets the dangerous remainder: files copied
 * into `out/` that only unpublished Markdown asks the browser to fetch.
 */
function exportedPageAssets() {
  const assets = new Set();

  function add(raw, route) {
    if (!raw) return;
    const path = localExportedResource(raw, route);
    if (path) assets.add(path);
  }

  for (const record of records) {
    for (const image of metaValues(record.html, 'property', 'og:image')) {
      add(image, record.route);
    }
    for (const image of metaValues(record.html, 'name', 'twitter:image')) {
      add(image, record.route);
    }
    for (const tag of tags(record.html, 'a')) {
      add(attribute(tag, 'href'), record.route);
    }
    for (const tag of tags(record.html, 'img|source')) {
      add(attribute(tag, 'src'), record.route);
      const srcset = attribute(tag, 'srcset');
      if (srcset) {
        for (const source of parseSrcset(srcset)) add(source, record.route);
      }
    }
    for (const tag of tags(
      record.html,
      'audio|embed|iframe|object|track|video',
    )) {
      add(attribute(tag, 'src'), record.route);
      add(attribute(tag, 'data'), record.route);
      add(attribute(tag, 'poster'), record.route);
    }
  }

  return assets;
}

const publicPageAssets = exportedPageAssets();

/**
 * Draft assets need not contain the draft slug. Parse the source with the same
 * grammar used by the renderer, resolve relative URLs from the eventual post
 * route, and reject any referenced file that otherwise has no public owner.
 *
 * Missing files are allowed: that is how a local draft can retain image slots
 * while the underlying screenshots stay outside public/. The development
 * renderer has a draft-only fallback for precisely that preview state.
 */
for (const draft of drafts) {
  const references = readMarkdownReferences(draft.content);
  if (draft.frontmatter.image) {
    references.push({ kind: 'image', target: draft.frontmatter.image });
  }

  for (const { kind, target } of references) {
    const route = `/writing/${draft.slug}/`;
    let url;
    try {
      url = new URL(target, siteUrlForRoute(route));
    } catch {
      fail(draft.source, `draft has an invalid ${kind} URL: ${target}`);
      continue;
    }

    if (!['http:', 'https:'].includes(url.protocol)) continue;
    if (url.origin !== SITE_ORIGIN) continue;
    if (isOutsideBasePath(url, draft.source, `draft ${kind}`, target)) continue;
    if (kind === 'link' && pageAt(url.pathname)) continue;
    if (
      exportedFileExists(url.pathname) &&
      !publicPageAssets.has(url.pathname)
    ) {
      fail(
        draft.source,
        `draft references a publicly exported ${kind}: ${url.pathname}`,
      );
    }
  }
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

  if (isOutsideBasePath(url, source.relativePath, label, raw)) return;

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

function validateExportedHeadAsset(raw, source, label) {
  const url = parseHttpUrl(raw, source.route, source.relativePath, label);
  if (!url) {
    fail(source.relativePath, `${label} must use HTTP or HTTPS: ${raw}`);
    return undefined;
  }
  if (url.origin !== SITE_ORIGIN) {
    fail(
      source.relativePath,
      `${label} uses ${url.origin}; expected ${SITE_ORIGIN}`,
    );
    return url;
  }
  if (isOutsideBasePath(url, source.relativePath, label, raw)) return url;
  if (!exportedFileExists(url.pathname)) {
    fail(source.relativePath, `${label} points at missing export: ${raw}`);
  }
  return url;
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
  isOutsideBasePath(url, source.relativePath, label, raw);
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

  const checkUrlCount = (values, noun) => {
    if (isIndexable && values.length !== 1) {
      fail(
        relativePath,
        `indexable page has ${values.length} ${noun}; expected 1`,
      );
    } else if (!isIndexable && values.length > 1) {
      fail(
        relativePath,
        `non-indexable page has ${values.length} ${noun}; expected at most 1`,
      );
    }
  };

  const canonicals = canonicalValues(html);
  checkUrlCount(canonicals, 'canonical links');

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
  checkUrlCount(ogUrls, 'og:url tags');

  const ogUrl = ogUrls[0]
    ? validateAbsoluteMetadataUrl(ogUrls[0], record, 'og:url')
    : undefined;
  if (canonicalUrl && ogUrl && canonicalUrl.href !== ogUrl.href) {
    fail(
      relativePath,
      `og:url ${ogUrl.href} does not match canonical ${canonicalUrl.href}`,
    );
  }

  for (const [key, name] of [
    ['property', 'og:image'],
    ['name', 'twitter:image'],
  ]) {
    for (const image of metaValues(html, key, name)) {
      const imageUrl = parseHttpUrl(image, route, relativePath, name);
      if (
        imageUrl?.origin === SITE_ORIGIN &&
        !exportedFileExists(imageUrl.pathname)
      ) {
        fail(
          relativePath,
          `${name} file missing from export: ${imageUrl.pathname}`,
        );
      }
    }
  }

  for (const tag of tags(html, 'a')) {
    const href = attribute(tag, 'href');
    if (href !== undefined) {
      validateInternalTarget(href, record, 'internal link');
    }
  }

  // Raw HTML forms survive Markdown rendering. Submit controls can override
  // their form's destination, so checking only action misses broken targets.
  for (const [elements, name] of [
    ['form', 'action'],
    ['button|input', 'formaction'],
  ]) {
    for (const tag of tags(html, elements)) {
      const target = attribute(tag, name);
      if (target !== undefined) {
        validateInternalTarget(target, record, 'form target');
      }
    }
  }

  // Validate the same resource forms collected above for public ownership.
  // An absent file must fail even when no draft also references it.
  for (const tag of tags(
    html,
    'img|source|audio|embed|iframe|object|track|video',
  )) {
    const label = /^<img\b/i.test(tag) ? 'image' : 'media';
    for (const name of ['src', 'data', 'poster']) {
      const target = attribute(tag, name);
      if (target !== undefined) validateInternalTarget(target, record, label);
    }
    const srcset = attribute(tag, 'srcset');
    if (srcset) {
      for (const target of parseSrcset(srcset)) {
        validateInternalTarget(target, record, 'srcset candidate');
      }
    }
  }

  if (isIndexable && !tags(html, 'title').length) {
    fail(relativePath, 'no <title>');
  }

  const manifestLinks = linkTagsForRel(html, 'manifest');
  const iconLinks = linkTagsForRel(html, 'icon');
  const appleIconLinks = linkTagsForRel(html, 'apple-touch-icon');

  for (const [label, links, expected] of [
    ['manifest link', manifestLinks, 1],
    ['icon links', iconLinks, 2],
    ['apple-touch-icon link', appleIconLinks, 1],
  ]) {
    if (links.length !== expected) {
      fail(relativePath, `has ${links.length} ${label}; expected ${expected}`);
    }
  }

  for (const [label, links] of [
    ['manifest link', manifestLinks],
    ['icon link', iconLinks],
    ['apple-touch-icon link', appleIconLinks],
  ]) {
    for (const tag of links) {
      const href = attribute(tag, 'href');
      if (href === undefined) {
        fail(relativePath, `${label} has no href`);
      } else {
        validateExportedHeadAsset(href, record, label);
      }
    }
  }
}

const home = recordsByRoute.get('/');
if (!home) {
  fail('manifest.json', 'cannot validate manifest without exported home page');
} else {
  const manifestTag = linkTagsForRel(home.html, 'manifest')[0];
  const manifestHref = manifestTag ? attribute(manifestTag, 'href') : undefined;
  const manifestUrl = manifestHref
    ? validateExportedHeadAsset(manifestHref, home, 'manifest link')
    : undefined;
  const manifestFile = manifestUrl
    ? exportFileFor(manifestUrl.pathname)
    : undefined;

  if (manifestFile && manifestUrl) {
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    } catch (error) {
      fail('manifest.json', `is not valid JSON: ${error.message}`);
    }

    const memberUrl = (raw, name) => {
      if (typeof raw !== 'string' || !raw.trim()) {
        fail('manifest.json', `${name} must be a non-empty URL string`);
        return undefined;
      }

      let url;
      try {
        url = new URL(raw, manifestUrl);
      } catch {
        fail('manifest.json', `${name} is not a valid URL: ${raw}`);
        return undefined;
      }

      if (url.origin !== SITE_ORIGIN) {
        fail('manifest.json', `${name} uses a foreign origin: ${url.origin}`);
      } else {
        isOutsideBasePath(url, 'manifest.json', name, raw);
      }
      return url;
    };

    const startUrl = memberUrl(manifest?.start_url, 'start_url');
    const scopeUrl = memberUrl(manifest?.scope, 'scope');

    if (
      startUrl &&
      !pageAt(startUrl.pathname) &&
      !exportedFileExists(startUrl.pathname)
    ) {
      fail(
        'manifest.json',
        `start_url points at missing export: ${startUrl.pathname}`,
      );
    }
    if (scopeUrl && !scopeUrl.pathname.endsWith('/')) {
      fail('manifest.json', `scope must end in "/": ${scopeUrl.pathname}`);
    }
    if (
      startUrl &&
      scopeUrl &&
      (startUrl.origin !== scopeUrl.origin ||
        !startUrl.pathname.startsWith(scopeUrl.pathname))
    ) {
      fail(
        'manifest.json',
        `start_url ${startUrl.pathname} is outside scope ${scopeUrl.pathname}`,
      );
    }

    if (!Array.isArray(manifest?.icons) || manifest.icons.length === 0) {
      fail('manifest.json', 'icons must contain at least one entry');
    } else {
      for (const [index, icon] of manifest.icons.entries()) {
        const name = `icons[${index}].src`;
        const iconUrl = memberUrl(icon?.src, name);

        if (
          iconUrl?.origin === SITE_ORIGIN &&
          routeForPublicPath(iconUrl.pathname) !== undefined &&
          !exportedFileExists(iconUrl.pathname)
        ) {
          fail(
            'manifest.json',
            `${name} points at missing export: ${icon.src}`,
          );
        }
      }
    }
  }
}

/** `raw` is already decoded: each caller decodes its own document's escaping. */
function validateXmlUrl(raw, documentName, options = {}) {
  let url;
  try {
    url = new URL(raw.trim());
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
    if (isOutsideBasePath(url, documentName, 'URL', raw.trim())) return url;
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
    (match) => decodeHtml(match[1]),
  );
  const guids = [...feed.matchAll(/<guid\b[^>]*>\s*([^<]+?)\s*<\/guid>/gi)].map(
    (match) => decodeHtml(match[1]),
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

/**
 * An HTML tag left in prose that should be plain text.
 *
 * Deliberately an element-name whitelist rather than `<[a-z/]...>`: résumé
 * prose is technical, and the broad form fires on generic and type syntax such
 * as `Map<string, number>` or `vector<int>` — exactly the strings `toPlainText`
 * in `src/lib/resumeJson.ts` preserves on purpose, and which
 * `src/lib/__tests__/resumeJson.test.ts` asserts survive untouched. The two
 * have to make the same promise or a summary mentioning a generic passes
 * `npm test` and then fails this gate with a message naming the wrong cause.
 *
 * The name must be followed by whitespace, `/`, or `>`, which rules out the
 * common generics (`Map<string, number>`, `Set<T>`, `Promise<Response>`). It
 * does not rule out all of them: a single-letter type parameter that happens
 * to spell an element name still matches, so `List<b>` and `Array<U>` read as
 * tags. That residue is deliberate — the alternative is letting a real `<b>`
 * through — and it is why this is a whitelist and not `<[a-z/]...>`, which
 * fires on every generic. Unhandled elements stay in the list so a construct
 * `toPlainText` does not yet strip still surfaces here rather than shipping.
 */
const HTML_TAG =
  /<\/[a-z][a-z0-9]*>|<(a|abbr|b|br|code|em|i|li|ol|p|span|strong|sub|sup|u|ul|canvas|div|img)(\s[^>]*)?\/?>/i;

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
  let parsed = false;
  try {
    resume = JSON.parse(readFileSync(resumeJsonPath, 'utf8'));
    parsed = true;
  } catch (error) {
    fail('resume.json', `is not valid JSON: ${error.message}`);
  }

  if (
    parsed &&
    (resume === null || typeof resume !== 'object' || Array.isArray(resume))
  ) {
    fail('resume.json', 'root must be a JSON object');
  } else if (parsed) {
    for (const key of Object.keys(resume)) {
      if (!JSON_RESUME_ROOT_KEYS.has(key)) {
        fail(
          'resume.json',
          `key is not part of the JSON Resume schema: ${key}`,
        );
      }
    }
    if (
      typeof resume.basics?.name !== 'string' ||
      resume.basics.name.trim() === ''
    ) {
      fail('resume.json', 'basics.name must be a non-empty string');
    }
    if (!Array.isArray(resume.work) || resume.work.length === 0) {
      fail('resume.json', 'work is missing or empty');
    } else {
      resume.work.forEach((entry, index) => {
        if (
          entry === null ||
          typeof entry !== 'object' ||
          Array.isArray(entry)
        ) {
          fail('resume.json', `work[${index}] must be a JSON object`);
        }
      });
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
      if (HTML_TAG.test(value) || /\[[^\]]+\]\([^)]*\)/.test(value)) {
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
  } else {
    const pointsAtResumeJson = (tag, label) => {
      const href = attribute(tag, 'href');
      const url = href
        ? parseHttpUrl(href, resumePage.route, resumePage.relativePath, label)
        : undefined;
      return url?.href === siteUrlForRoute('/resume.json');
    };

    if (
      !tags(resumePage.html, 'a').some((tag) =>
        pointsAtResumeJson(tag, 'resume JSON link'),
      )
    ) {
      fail(
        'resume.json',
        '/resume/ does not link to the machine-readable resume',
      );
    }

    if (
      !linkTagsForRel(resumePage.html, 'alternate').some(
        (tag) =>
          attribute(tag, 'type')?.toLowerCase() === 'application/json' &&
          pointsAtResumeJson(tag, 'resume JSON alternate'),
      )
    ) {
      fail(
        'resume.json',
        '/resume/ does not advertise the machine-readable resume',
      );
    }
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
    '(draft routes and referenced assets, robots, ids/fragments, canonicals, complete share metadata, icons/manifest, local images/media, internal links and form targets, sitemap/RSS, resume.json)',
);
