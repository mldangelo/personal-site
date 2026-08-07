/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Hosted on Vercel: no `output: 'export'`, so Server Components, ISR, and
  // next/image optimization are all available.
  images: {
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;
