'use client';

import { useEffect, useState } from 'react';

import { ageAt, ageIntervalFor, agePlaceholder } from '@/lib/telemetry';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * A live age readout.
 *
 * Returns a fixed-width placeholder until the first client tick so server and
 * client markup agree and the readout does not reflow on hydration.
 *
 * Three things keep this from being wasteful or unpleasant:
 *
 * - Cadence is derived from `precision`, so the timer fires roughly when the
 *   last displayed digit actually changes rather than at a fixed 25ms.
 * - Under `prefers-reduced-motion` the reading is taken once and left to
 *   stand. Digits changing several times a second is precisely the motion
 *   that setting asks us to avoid, and this readout is above the fold.
 * - Ticking pauses while the tab is hidden, and resyncs on return.
 *
 * The listeners mean both the OS preference and tab visibility take effect
 * without a reload.
 */
export default function useLiveAge(precision: number): string {
  const [age, setAge] = useState(() => agePlaceholder(precision));

  useEffect(() => {
    const tick = () => setAge(ageAt(Date.now(), precision));

    // jsdom and older browsers may not implement matchMedia; a missing
    // preference is treated as "no preference", matching the rest of the site.
    const media = window.matchMedia?.(REDUCED_MOTION);
    const interval = ageIntervalFor(precision);
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };

    const sync = () => {
      stop();
      tick();

      if (media?.matches || document.hidden) {
        return;
      }

      timer = setInterval(tick, interval);
    };

    sync();
    media?.addEventListener?.('change', sync);
    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      media?.removeEventListener?.('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [precision]);

  return age;
}
