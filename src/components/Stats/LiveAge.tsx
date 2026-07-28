'use client';

import useLiveAge from '@/hooks/useLiveAge';
import { agePlaceholder } from '@/lib/telemetry';

import Readout from './Readout';

interface LiveAgeProps {
  /** The age the build measured, at `AGE_PRECISION_STATIC`. */
  initial: string;
  /** When that reading was taken, e.g. `as of 2026-07-28`. */
  note: string;
  /** Decimal places to upgrade to once the client is driving. */
  precision: number;
}

/**
 * The age readout: the whole client boundary of the personal stats table.
 *
 * It used to be the table. `src/data/stats/personal.tsx` carried a `'use
 * client'` directive so it could hold this component as a value, which pulled
 * the declarations, `resolveReadings`, `Table`, and `TableRow` across with it —
 * and shipped `--.-----------` as the only age any crawler, no-JS visitor, or
 * printed copy ever saw. Now the server renders the reading it can prove and
 * this span upgrades the precision in place.
 *
 * `initial` is a prop rather than a recomputed value on purpose: the client
 * clock is not the build clock, and a locally computed initial would differ from
 * the server's markup by however long the deploy has been live.
 *
 * The note goes once the reading is live. `as of 2026-07-28` is true of the
 * build-time value and false of a value that is advancing 40 times a second.
 */
export default function LiveAge({ initial, note, precision }: LiveAgeProps) {
  const { ref, live } = useLiveAge<HTMLSpanElement>(precision, initial);

  return (
    <Readout
      elementRef={ref}
      initial={initial}
      live={live}
      note={live ? undefined : note}
      width={Math.max(initial.length, agePlaceholder(precision).length)}
    />
  );
}
