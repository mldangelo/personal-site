'use client';

import { useEffect, useState } from 'react';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Returns `false` on the server and for the first client paint so markup
 * matches, then settles to the real preference. It also subscribes to changes,
 * so toggling the OS setting takes effect without a reload — the three
 * hand-rolled `matchMedia` reads this replaced each did something slightly
 * different, and only one of them listened.
 *
 * `matchMedia` is optional-chained because jsdom does not implement it; a
 * missing preference is treated as "no preference".
 */
export default function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (!media) return;

    const sync = () => setPrefersReduced(media.matches);

    sync();
    media.addEventListener?.('change', sync);

    return () => media.removeEventListener?.('change', sync);
  }, []);

  return prefersReduced;
}
