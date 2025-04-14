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
};

module.exports = nextConfig; 