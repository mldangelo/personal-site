'use client';

import { useEffect, useState } from 'react';

import { ageAt, ageIntervalFor, agePlaceholder } from '@/lib/telemetry';

import usePrefersReducedMotion from './usePrefersReducedMotion';

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
 * - Under reduced motion the reading is taken once and left to stand. Digits
 *   changing several times a second is precisely the motion that setting asks
 *   us to avoid, and this readout is above the fold.
 * - Ticking pauses while the tab is hidden, and resyncs on return.
 */
export default function useLiveAge(precision: number): string {
  const [age, setAge] = useState(() => agePlaceholder(precision));
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const tick = () => setAge(ageAt(Date.now(), precision));
    const interval = ageIntervalFor(precision);
    let timer: ReturnType<typeof setInterval> | undefined;

    const sync = () => {
      clearInterval(timer);
      timer = undefined;
      tick();

      if (prefersReducedMotion || document.hidden) {
        return;
      }

      timer = setInterval(tick, interval);
    };

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [precision, prefersReducedMotion]);

  return age;
}
