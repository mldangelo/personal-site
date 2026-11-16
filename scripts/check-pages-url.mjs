/**
 * Fails a GitHub Pages deployment whose `homepage` is not where Pages serves
 * the repository. Every address in the export derives from `homepage`, so a
 * fork that still names the upstream site, or a project site built for a root
 * URL, would publish pages whose links, styles, and images all miss.
 *
 * PAGES_URL is the `base_url` output of `actions/configure-pages`.
 */
import { readSiteConfig } from './lib/site.mjs';

const LABEL = 'check-pages-url';
const { origin, basePath } = readSiteConfig(process.cwd(), LABEL);
const homepage = `${origin}${basePath}/`;

const reported = process.env.PAGES_URL;
if (!reported) {
  console.error(`${LABEL}: PAGES_URL is not set`);
  process.exit(1);
}

// Pages reports `http://` until HTTPS is enforced, and `homepage` must be
// HTTPS, so only the host and path have to agree.
const pages = new URL(reported.endsWith('/') ? reported : `${reported}/`);
const expected = `https://${pages.host}${pages.pathname}`;

if (expected !== homepage) {
  console.error(
    `::error file=package.json::homepage is ${homepage}, but GitHub Pages serves this repository at ${expected}. ` +
      `Run \`npm pkg set homepage=${expected}\`, commit, and push again.`,
  );
  process.exit(1);
}

console.log(`${LABEL}: homepage matches the GitHub Pages URL, ${homepage}`);
