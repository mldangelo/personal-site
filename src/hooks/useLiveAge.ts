'use client';

import { useEffect, useState } from 'react';

import {
  AGE_UPDATE_INTERVAL,
  ageAt,
  agePlaceholder,
} from '@/lib/telemetry';

/**
 * A live age readout, advancing every {@link AGE_UPDATE_INTERVAL} ms.
 *
 * Returns a fixed-width placeholder until the first client tick so server and
 * client markup agree and the readout does not reflow on hydration.
 */
export default function useLiveAge(precision: number): string {
  const [age, setAge] = useState(() => agePlaceholder(precision));

  useEffect(() => {
    const tick = () => setAge(ageAt(Date.now(), precision));

    tick();
    const timer = setInterval(tick, AGE_UPDATE_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [precision]);

  return age;
}
