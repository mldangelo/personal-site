'use client';

import { useEffect, useState } from 'react';

/**
 * Whether a media query matches, kept live through its `change` events.
 *
 * `null` on the server and for the first client paint, so markup matches,
 * then the real answer. `matchMedia` is optional-chained because jsdom does not
 * implement it; with no way to ask, the answer stays `null`.
 */
export default function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;

    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener?.('change', sync);

    return () => media.removeEventListener?.('change', sync);
  }, [query]);

  return matches;
}
