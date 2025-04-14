/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // For static site generation similar to the current setup
  images: {
    unoptimized: true, // Required for static export
  },
  sassOptions: {
    includePaths: ['./app/styles'],
  },
  eslint: {
    // Skip ESLint during builds since we're using Biome
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
