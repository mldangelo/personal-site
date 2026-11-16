/**
 * Whether a nav entry represents the page currently being viewed.
 *
 * Shared so the desktop nav and the mobile menu cannot drift.
 */
export function isActiveRoute(pathname: string | null, path: string): boolean {
  if (!pathname) return false;
  // GitHub Pages also serves each page's file by name: `/index.html` is the
  // homepage, and `/about/index.html` is About.
  const current = pathname.replace(/\/index\.html$/, '/');
  if (path === '/') return current === '/';

  const route = path.replace(/\/+$/, '');
  return current === route || current.startsWith(`${route}/`);
}
