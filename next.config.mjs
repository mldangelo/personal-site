import { readFileSync } from 'node:fs';

import bundleAnalyzer from '@next/bundle-analyzer';

import { parseSiteUrl } from './src/lib/site-url.mjs';

const { homepage } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

/**
 * A GitHub Codespace forwards the dev server to
 * `NAME-PORT.app.github.dev`, which the dev server would otherwise refuse,
 * live-reload socket included. A pattern cannot cover part of a label, so the
 * entry is this codespace's own host for the port `next dev` uses.
 */
function codespaceOrigin() {
  const { CODESPACE_NAME, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN, PORT } =
    process.env;
  return CODESPACE_NAME && GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? [
        `${CODESPACE_NAME}-${PORT ?? 3000}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`,
      ]
    : [];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // `/repo` when `homepage` is a project site such as
  // `https://user.github.io/repo/`, and empty at a root URL.
  basePath: parseSiteUrl(homepage).basePath,

  // Hostname patterns, not origins: lets a phone on the LAN load the dev
  // server, and a Codespace's forwarded port keep live reload.
  allowedDevOrigins: ['192.168.*.*', ...codespaceOrigin()],

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  // Experimental features
  experimental: {
    // TypeScript 7 is the native compiler and does not expose the JavaScript
    // compiler API that Next's build-time type check reaches for, so the build
    // fails outright without this. Shelling out to the TypeScript CLI is the
    // path Next itself names in that error. Verified that type errors still
    // fail the build under this flag — see AGENTS.md.
    useTypeScriptCli: true,
  },
};

if (process.env.ANALYZE === 'true') {
  Object.assign(nextConfig, bundleAnalyzer({ enabled: true })(nextConfig));
}

export default nextConfig;
