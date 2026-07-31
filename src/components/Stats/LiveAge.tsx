'use client';

import type { CSSProperties } from 'react';

import useLiveAge from '@/hooks/useLiveAge';
import { agePlaceholder } from '@/lib/telemetry';

interface LiveAgeProps {
  /** The coarse age snapshot rendered by the server. */
  initial: string;
  /** When the snapshot was taken, for example `as of 2026-07-31`. */
  note: string;
  /** Decimal places used while the browser is actively updating the age. */
  precision: number;
}

type ReadoutStyle = CSSProperties & {
  '--readout-width': string;
};

/**
 * The only client leaf in the personal stats table.
 *
 * React always owns `initial`; the hook upgrades the text node in place while
 * the page is visible. The note line stays mounted so hydration does not move
 * later rows, and it states "Live" whenever the amber signal is active.
 */
export default function LiveAge({ initial, note, precision }: LiveAgeProps) {
  const { ref, live } = useLiveAge<HTMLSpanElement>(precision, initial);
  const width = Math.max(initial.length, agePlaceholder(precision).length);
  const style: ReadoutStyle = { '--readout-width': `${width}ch` };

  return (
    <>
      <span
        className="stat-readout-value"
        data-live={live}
        ref={ref}
        style={style}
      >
        {initial}
      </span>
      <span className="stat-readout-note">{live ? 'Live' : note}</span>
    </>
  );
}
