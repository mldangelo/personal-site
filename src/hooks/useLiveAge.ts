'use client';

import { useCallback } from 'react';

import { ageAt, ageIntervalFor, agePlaceholder } from '@/lib/telemetry';

import useLiveReadout, { type LiveReadout } from './useLiveReadout';

/**
 * A live age readout, written straight to the DOM.
 *
 * Returns `{ ref, live }` from `useLiveReadout`, where the whole contract —
 * out-of-band `textContent` writes, no state per tick, reduced-motion and
 * visibility handling — is documented and shared with the build clock.
 *
 * `initial` is the content the element already shows. Pass the string the
 * server rendered: on `/stats` that is the age at `AGE_PRECISION_STATIC`,
 * threaded through as a prop so the client cannot compute a different one, and
 * this hook upgrades it to `AGE_PRECISION_FULL` on mount. It is also what the
 * element is restored to on cleanup. With nothing to pass, the default is
 * `agePlaceholder(precision)` — fixed-width and digit-free, so it cannot be
 * mistaken for a measurement.
 */
export default function useLiveAge<T extends HTMLElement = HTMLSpanElement>(
  precision: number,
  initial: string = agePlaceholder(precision),
): LiveReadout<T> {
  const read = useCallback((now: number) => ageAt(now, precision), [precision]);

  return useLiveReadout<T>(read, ageIntervalFor(precision), initial);
}
