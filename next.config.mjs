import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Hostname patterns, not origins: lets a phone on the LAN load the dev server.
  allowedDevOrigins: ['192.168.*.*'],

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

// Keep the default export as a direct config identifier. GitHub's
// configure-pages action edits this object before repository-site builds to
// inject their basePath; it cannot see through a wrapping function call.
if (process.env.ANALYZE === 'true') {
  Object.assign(nextConfig, bundleAnalyzer({ enabled: true })(nextConfig));
}

export default nextConfig;
