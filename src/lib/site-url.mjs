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
