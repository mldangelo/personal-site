/**
 * The exported site's URL shape, derived from `package.json` `homepage`.
 *
 * Repository-site forks publish under a base path (`https://user.github.io/
 * repo/`), so every script that maps a URL found in the export back to a file
 * on disk has to agree on how that prefix is stripped. Two implementations of
 * this drift, and the fork is where the drift shows up.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

/**
 * `label` prefixes the failure message so the caller is identifiable in CI
 * logs. Exits rather than throwing: every caller is a build gate.
 */
export function readSiteConfig(root, label) {
  const packagePath = resolve(root, 'package.json');
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
      `${label}: cannot read the canonical site URL from package.json: ${error.message}`,
    );
    process.exit(1);
  }
}

/** URLs always use forward slashes; `relative` uses the platform separator. */
export const toUrlPath = (path) => path.split(sep).join('/');

/**
 * Route helpers bound to one export directory and one base path.
 *
 * Returned as a bundle rather than free functions taking `basePath` because
 * every call site in a given script wants the same configuration, and passing
 * it around is how one of them ends up forgetting.
 */
export function exportLayout({ outDir, origin, basePath }) {
  const publicPathForRoute = (route) => `${basePath}${route}`;

  const routeForPublicPath = (pathname) => {
    if (!basePath) return pathname;
    if (pathname === `${basePath}/`) return '/';
    if (!pathname.startsWith(`${basePath}/`)) return undefined;
    return pathname.slice(basePath.length);
  };

  const siteUrlForRoute = (route) => `${origin}${publicPathForRoute(route)}`;

  const routeForHtml = (relativePath) => {
    if (relativePath === 'index.html') return '/';
    if (relativePath.endsWith('/index.html')) {
      return `/${relativePath.slice(0, -'index.html'.length)}`;
    }
    return `/${relativePath}`;
  };

  /**
   * The file a public path resolves to inside the export, or `undefined` when
   * it is undecodable, outside the base path, escapes `outDir`, or is not a
   * file. Callers that only need existence can compare against `undefined`.
   */
  const exportFileFor = (pathname) => {
    let decoded;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      return undefined;
    }

    const route = routeForPublicPath(decoded);
    if (route === undefined) return undefined;

    const candidate = resolve(outDir, route.replace(/^\/+/, ''));
    if (candidate !== outDir && !candidate.startsWith(`${outDir}${sep}`)) {
      return undefined;
    }
    if (!existsSync(candidate) || !statSync(candidate).isFile()) {
      return undefined;
    }
    return candidate;
  };

  return {
    origin,
    basePath,
    exportFileFor,
    publicPathForRoute,
    routeForHtml,
    routeForPublicPath,
    siteUrlForRoute,
  };
}
