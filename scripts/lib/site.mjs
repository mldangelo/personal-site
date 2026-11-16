/**
 * The exported site's URL shape, derived from `package.json` `homepage`.
 *
 * Repository-site forks publish under a base path (`https://user.github.io/
 * repo/`), so every script that maps a URL found in the export back to a file
 * on disk has to agree on how that prefix is stripped. Two implementations of
 * this drift, and the fork is where the drift shows up.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

import { parseSiteUrl } from '../../src/lib/site-url.mjs';

/**
 * The site URL from `package.json` `homepage`, through the parser the site
 * itself uses. `label` prefixes the failure message so the caller is
 * identifiable in CI logs. Exits rather than throwing: every caller is a build
 * gate.
 */
export function readSiteConfig(root, label) {
  const packagePath = resolve(root, 'package.json');
  try {
    const { homepage, repository } = JSON.parse(
      readFileSync(packagePath, 'utf8'),
    );
    const { origin, basePath } = parseSiteUrl(homepage);
    return { origin, basePath, pagesAlias: pagesAddress(repository) };
  } catch (error) {
    console.error(
      `${label}: cannot read the canonical site URL from package.json: ${error.message}`,
    );
    process.exit(1);
  }
}

/**
 * Where GitHub Pages serves the repository `package.json` names, as a host and
 * a path prefix: `owner.github.io` and `/repo`, or no prefix for the owner's
 * own `owner.github.io` repository. With a custom domain it redirects there,
 * so a link through it still reaches this site's files.
 */
function pagesAddress(repository) {
  const url = typeof repository === 'string' ? repository : repository?.url;
  const [, owner, repo] =
    /github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i.exec(url ?? '') ?? [];
  if (!owner) return undefined;

  const host = `${owner}.github.io`.toLowerCase();
  return { host, pathPrefix: repo.toLowerCase() === host ? '' : `/${repo}` };
}

/** URLs always use forward slashes; `relative` uses the platform separator. */
export const toUrlPath = (path) => path.split(sep).join('/');

/** Every file under `dir`, or nothing if it does not exist. */
export function walkFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

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
