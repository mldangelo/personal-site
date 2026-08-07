import type { MetadataRoute } from 'next';

/**
 * Replaces the old static public/images/favicon/site.webmanifest, whose icon
 * `src` paths pointed at the site root while the files actually live under
 * /images/favicon — so neither maskable icon ever resolved.
 */
const manifest = (): MetadataRoute.Manifest => ({
  name: 'Dase.dev',
  short_name: 'Dase',
  icons: [
    {
      src: '/images/favicon/web-app-manifest-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: '/images/favicon/web-app-manifest-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ],
  theme_color: '#f6f2ea',
  background_color: '#f6f2ea',
  display: 'standalone'
});

export default manifest;
