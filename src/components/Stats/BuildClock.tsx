'use client';

import { useCallback } from 'react';

import useLiveReadout from '@/hooks/useLiveReadout';
import {
  BUILD_CLOCK_INTERVAL,
  elapsedPlaceholder,
  elapsedSince,
} from '@/lib/telemetry';

import Readout from './Readout';

interface BuildClockProps {
  /** When the build ran, in milliseconds since the epoch. */
  builtAt: number;
  /** The build date the server rendered, e.g. `2026-07-28`. */
  initial: string;
}

/**
 * How long ago this build ran, counting.
 *
 * A value that is genuinely live and increasing, which is what earns it
 * `--color-signal` under the palette rule — but only once it is counting. With
 * the power off the reading is the build date, in ordinary ink, noted `UTC`;
 * once the client takes over it becomes `4d 03:12:07`, noted `ago`. Both are
 * true of the row's label, and neither claims to be the other. A duration is the
 * one thing the server must not render here: elapsed time at build is
 * `00:00:00`, which would tell every reader the deploy had just happened.
 *
 * It ticks once a second, not at the age readout's 25ms floor. Seconds is the
 * smallest unit it shows, and the eleven-decimal age is deliberately the only
 * absurdly precise reading on this page.
 */
export default function BuildClock({ builtAt, initial }: BuildClockProps) {
  const read = useCallback(
    (now: number) => elapsedSince(builtAt, now),
    [builtAt],
  );
  const { ref, live } = useLiveReadout<HTMLSpanElement>(
    read,
    BUILD_CLOCK_INTERVAL,
    initial,
  );

  return (
    <Readout
      elementRef={ref}
      initial={initial}
      live={live}
      note={live ? 'ago' : 'UTC'}
      width={Math.max(initial.length, elapsedPlaceholder().length)}
    />
  );
}
