'use client';

import { useEffect, useState } from 'react';

import { AGE_UPDATE_INTERVAL, ageAt, agePlaceholder } from '@/lib/telemetry';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * A live age readout, advancing every {@link AGE_UPDATE_INTERVAL} ms.
 *
 * Returns a fixed-width placeholder until the first client tick so server and
 * client markup agree and the readout does not reflow on hydration.
 *
 * Under `prefers-reduced-motion` the reading is taken once and left to stand.
 * Digits changing forty times a second is precisely the motion that setting
 * asks us to avoid, and this readout sits above the fold on the homepage — so
 * the value stays accurate, it just stops animating. The listener means
 * toggling the OS setting takes effect without a reload.
 */
export default function useLiveAge(precision: number): string {
  const [age, setAge] = useState(() => agePlaceholder(precision));

  useEffect(() => {
    const tick = () => setAge(ageAt(Date.now(), precision));

    // jsdom and older browsers may not implement matchMedia; a missing
    // preference is treated as "no preference", matching the rest of the site.
    const media = window.matchMedia?.(REDUCED_MOTION);
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      clearInterval(timer);
      timer = undefined;
      tick();

      if (!media?.matches) {
        timer = setInterval(tick, AGE_UPDATE_INTERVAL);
      }
    };

    start();
    media?.addEventListener?.('change', start);

    return () => {
      clearInterval(timer);
      media?.removeEventListener?.('change', start);
    };
  }, [precision]);

  return age;
}
