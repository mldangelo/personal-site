import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Allow dev server access from local network (mobile testing, etc.)
  allowedDevOrigins: ['http://192.168.*.*:3000'],

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  // Turbopack configuration (used in development)
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/fontawesome-svg-core',
    ],
  },
};

// Keep the default export as a direct config identifier. GitHub's
// configure-pages action edits this object before repository-site builds to
// inject their basePath; it cannot see through a wrapping function call.
if (process.env.ANALYZE === 'true') {
  Object.assign(nextConfig, bundleAnalyzer({ enabled: true })(nextConfig));
}

export default nextConfig;
