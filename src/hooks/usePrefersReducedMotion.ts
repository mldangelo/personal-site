'use client';

import useMediaQuery from './useMediaQuery';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the visitor has asked for reduced motion: `false` until the
 * preference is known, so the server and first client paint match, then the
 * live answer, which follows the OS setting without a reload.
 */
export default function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY) ?? false;
}
