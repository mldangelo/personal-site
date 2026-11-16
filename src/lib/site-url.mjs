/**
 * The site's public URL, read from `homepage` in `package.json`: the one
 * setting a fork changes to publish somewhere else. Everything with an address
 * derives from it — Next's `basePath`, canonical and share URLs, the feed, the
 * sitemap, `robots.txt`, `resume.json`, and the export gates — so a project
 * site at `https://user.github.io/repo/` needs nothing more than a root domain.
 *
 * Plain JavaScript, so `next.config.mjs` and the Node scripts read it too.
 */

/**
 * Throws unless `homepage` is an HTTPS URL ending in a slash, with no query or
 * fragment. `basePath` is `''` at a root URL and `/repo` under a subpath, and
 * `siteUrl` is the origin plus that path, with no trailing slash.
 */
export function parseSiteUrl(homepage) {
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

  const basePath = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
  return { origin: url.origin, basePath, siteUrl: `${url.origin}${basePath}` };
}

/**
 * A root-relative path as a browser must request it. Next prefixes the base
 * path onto its own links, scripts, and metadata, but not onto a raw `src` or
 * `href`; other URLs pass through unchanged.
 */
export function prefixBasePath(basePath, path) {
  return path.startsWith('/') && !path.startsWith('//')
    ? `${basePath}${path}`
    : path;
}

/**
 * The candidates of a `srcset`, split the way the HTML parser splits them: a
 * URL runs to the next whitespace, so a file name or data URL may contain
 * commas, and trailing commas end a candidate that has no descriptor. The
 * descriptor is returned as written, for the caller to judge.
 */
export function splitSrcset(value) {
  const candidates = [];
  let index = 0;

  while (index < value.length) {
    while (index < value.length && /[\t\n\f\r ,]/.test(value[index])) {
      index += 1;
    }
    if (index >= value.length) break;

    const urlStart = index;
    while (index < value.length && !/[\t\n\f\r ]/.test(value[index])) {
      index += 1;
    }

    const url = value.slice(urlStart, index);
    if (url.endsWith(',')) {
      candidates.push({ url: url.replace(/,+$/, ''), descriptor: '' });
      continue;
    }

    const descriptorStart = index;
    let parentheses = 0;
    while (index < value.length) {
      const character = value[index];
      if (character === '(') parentheses += 1;
      if (character === ')') parentheses -= 1;
      if (character === ',' && parentheses <= 0) break;
      index += 1;
    }
    candidates.push({
      url,
      descriptor: value.slice(descriptorStart, index).trim(),
    });
  }

  return candidates;
}

/** A `srcset` with the base path on each root-relative candidate. */
export function prefixSrcset(basePath, value) {
  return splitSrcset(value)
    .map(({ url, descriptor }) =>
      [prefixBasePath(basePath, url), descriptor].filter(Boolean).join(' '),
    )
    .join(', ');
}
