import { SITE_URL } from './utils';

const SITE_ORIGIN = new URL(SITE_URL).origin;

/**
 * Off-site http(s) destinations. In-site paths, hashes, mailto, and tel stay
 * in the current tab so navigation and mail clients keep working as expected.
 */
export function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;

  const trimmed = href.trim();
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return false;
  }

  try {
    const url = new URL(trimmed, `${SITE_URL}/`);
    return url.origin !== SITE_ORIGIN;
  } catch {
    return false;
  }
}

export function newTabProps(
  href: string | undefined,
): { target: '_blank'; rel: 'noopener noreferrer' } | Record<string, never> {
  if (!isExternalHref(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}
