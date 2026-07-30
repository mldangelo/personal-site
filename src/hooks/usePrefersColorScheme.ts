'use client';

import { useEffect, useState } from 'react';

import { DARK_SCHEME_QUERY, type ResolvedTheme } from '@/lib/theme';

/**
 * The colour scheme the visitor's device is currently asking for.
 *
 * Returns `null` on the server and for the first client paint. Unlike reduced
 * motion there is no safe default to assume — assuming `light` would flash a
 * dark-mode visitor — and `<html data-theme>` already carries the answer from
 * the pre-paint bootstrap, so callers should leave it alone until this settles.
 *
 * It subscribes to `change`, which is the whole point: the read this replaced
 * sampled the preference once at mount, so a visitor who arrived in the
 * morning stayed on the light theme when their device flipped at sunset. This
 * is the same shape as `usePrefersReducedMotion` for the same reason — the
 * hand-rolled `matchMedia` reads drifted, and only some of them listened.
 *
 * `matchMedia` is optional-chained because jsdom does not implement it; with no
 * way to ask, the preference stays unknown.
 */
export default function usePrefersColorScheme(): ResolvedTheme | null {
  const [scheme, setScheme] = useState<ResolvedTheme | null>(null);

  useEffect(() => {
    const media = window.matchMedia?.(DARK_SCHEME_QUERY);
    if (!media) return;

    const sync = () => setScheme(media.matches ? 'dark' : 'light');

    sync();
    media.addEventListener?.('change', sync);

    return () => media.removeEventListener?.('change', sync);
  }, []);

  return scheme;
}
