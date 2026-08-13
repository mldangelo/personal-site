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
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';

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

/** URLs always use forward slashes; `relative` uses the platform separator. */
const toUrlPath = (path) => path.split(sep).join('/');

function routeForHtml(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `/${relativePath}`;
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    );
}

function tags(html, name = '[a-z][\\w:-]*') {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(
    (match) => match[0],
  );
}

function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  return value === undefined ? undefined : decodeHtml(value);
}

function metaValues(html, key, value) {
  return tags(html, 'meta')
    .filter((tag) => attribute(tag, key)?.toLowerCase() === value)
    .map((tag) => attribute(tag, 'content'))
    .filter((content) => content !== undefined);
}

function canonicalValues(html) {
  return tags(html, 'link')
    .filter((tag) =>
      (attribute(tag, 'rel') ?? '')
        .toLowerCase()
        .split(/\s+/)
        .includes('canonical'),
    )
    .map((tag) => attribute(tag, 'href'))
    .filter((href) => href !== undefined);
}

function linkTagsForRel(html, value) {
  return tags(html, 'link').filter((tag) =>
    (attribute(tag, 'rel') ?? '').toLowerCase().split(/\s+/).includes(value),
  );
}

function readSiteConfig() {
  const packagePath = resolve(ROOT, 'package.json');
  try {
    const { homepage } = JSON.parse(readFileSync(packagePath, 'utf8'));
    const url = new URL(homepage);
    if (
      url.protocol !== 'https:' ||
      url.search ||
      url.hash ||
      !url.pathname.endsWith('/')
    ) {
      throw new Error(
        'homepage must be an HTTPS URL with a trailing slash and no query/hash',
      );
    }

    const basePath =
      url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
    return { origin: url.origin, basePath };
  } catch (error) {
    console.error(
      `verify-export: cannot read the canonical site URL from package.json: ${error.message}`,
    );
    process.exit(1);
  }
}

const { origin: SITE_ORIGIN, basePath: SITE_BASE_PATH } = readSiteConfig();

function publicPathForRoute(route) {
  return `${SITE_BASE_PATH}${route}`;
}

function routeForPublicPath(pathname) {
  if (!SITE_BASE_PATH) return pathname;
  if (pathname === `${SITE_BASE_PATH}/`) return '/';
  if (!pathname.startsWith(`${SITE_BASE_PATH}/`)) return undefined;
  return pathname.slice(SITE_BASE_PATH.length);
}

function siteUrlForRoute(route) {
  return `${SITE_ORIGIN}${publicPathForRoute(route)}`;
}

const pages = walk(OUT, (name) => name.endsWith('.html'));

if (pages.length === 0) {
  console.error('verify-export: no HTML found in out/. Did the build run?');
  process.exit(1);
}

const draftSlugs = walk(CONTENT, (name) => name.endsWith('.md'))
  // Use the same YAML parser as the application. A line regex misses valid
  // forms such as `draft: true # keep private`, weakening the fault-injection
  // gate precisely when the route layer regresses.
  .filter((path) => matter(readFileSync(path, 'utf8')).data.draft === true)
  .map((path) => basename(path, '.md'));

function isDraftPath(pathname) {
  const route = routeForPublicPath(pathname) ?? pathname;
  return draftSlugs.some(
    (slug) =>
      route === `/writing/${slug}` || route.startsWith(`/writing/${slug}/`),
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

function exportedFileForPathname(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }

  const route = routeForPublicPath(decoded);
  if (route === undefined) return undefined;

  const candidate = resolve(OUT, route.replace(/^\/+/, ''));
  if (candidate !== OUT && !candidate.startsWith(`${OUT}${sep}`)) {
    return undefined;
  }
  return existsSync(candidate) && statSync(candidate).isFile()
    ? candidate
    : undefined;
}

function exportedFileExists(pathname) {
  return exportedFileForPathname(pathname) !== undefined;
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
  if (routeForPublicPath(url.pathname) === undefined) {
    fail(
      source.relativePath,
      `${label} points outside configured base path ${SITE_BASE_PATH}/: ${raw}`,
    );
    return url;
  }
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
    ? exportedFileForPathname(manifestUrl.pathname)
    : undefined;

  if (manifestFile && manifestUrl) {
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    } catch (error) {
      fail('manifest.json', `is not valid JSON: ${error.message}`);
    }

    const memberUrl = (name) => {
      const raw = manifest?.[name];
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
      } else if (routeForPublicPath(url.pathname) === undefined) {
        fail(
          'manifest.json',
          `${name} points outside configured base path ${SITE_BASE_PATH}/: ${raw}`,
        );
      }
      return url;
    };

    const startUrl = memberUrl('start_url');
    const scopeUrl = memberUrl('scope');

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
        if (typeof icon?.src !== 'string' || !icon.src.trim()) {
          fail(
            'manifest.json',
            `icons[${index}].src must be a non-empty URL string`,
          );
          continue;
        }

        let iconUrl;
        try {
          iconUrl = new URL(icon.src, manifestUrl);
        } catch {
          fail(
            'manifest.json',
            `icons[${index}].src is not a valid URL: ${icon.src}`,
          );
          continue;
        }

        if (iconUrl.origin !== SITE_ORIGIN) {
          fail(
            'manifest.json',
            `icons[${index}].src uses a foreign origin: ${iconUrl.origin}`,
          );
        } else if (routeForPublicPath(iconUrl.pathname) === undefined) {
          fail(
            'manifest.json',
            `icons[${index}].src points outside configured base path ${SITE_BASE_PATH}/: ${icon.src}`,
          );
        } else if (!exportedFileExists(iconUrl.pathname)) {
          fail(
            'manifest.json',
            `icons[${index}].src points at missing export: ${icon.src}`,
          );
        }
      }
    }
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

if (failures.length > 0) {
  console.error(`\nverify-export: ${failures.length} problem(s)\n`);
  for (const { page, message } of failures) {
    console.error(`  ${page}\n    ${message}`);
  }
  process.exit(1);
}

console.log(
  `verify-export: ${pages.length} pages OK ` +
    '(drafts, robots, ids/fragments, canonicals, complete share metadata, icons/manifest, local images, internal links, sitemap/RSS)',
);
