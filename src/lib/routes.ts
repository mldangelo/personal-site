/**
 * Whether a nav entry represents the page currently being viewed.
 *
 * Shared so the desktop nav and the mobile menu cannot drift — the mobile
 * menu previously highlighted nothing at all.
 */
export function isActiveRoute(pathname: string | null, path: string): boolean {
  if (!pathname) return false;
  if (path === '/') return pathname === '/';

  const route = path.replace(/\/+$/, '');
  return pathname === route || pathname.startsWith(`${route}/`);
}
