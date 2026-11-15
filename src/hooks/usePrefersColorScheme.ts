'use client';

import { DARK_SCHEME_QUERY, type ResolvedTheme } from '@/lib/theme';

import useMediaQuery from './useMediaQuery';

/**
 * The colour scheme the visitor's device is currently asking for.
 *
 * `null` on the server and for the first client paint. Unlike reduced motion
 * there is no safe default to assume — assuming `light` would flash a
 * dark-mode visitor — and `<html data-theme>` already carries the answer from
 * the pre-paint bootstrap, so callers should leave it alone until this settles.
 * It follows the device live, so one that flips at sunset takes the page with
 * it. Use this rather than a hand-rolled `matchMedia` read.
 */
export default function usePrefersColorScheme(): ResolvedTheme | null {
  const dark = useMediaQuery(DARK_SCHEME_QUERY);

  return dark === null ? null : dark ? 'dark' : 'light';
}
