'use client';

import type { CSSProperties, Ref } from 'react';

interface ReadoutProps {
  /** The element the hook writes readings into. */
  elementRef: Ref<HTMLSpanElement>;
  /** What the server rendered. Rendered verbatim, and never recomputed here. */
  initial: string;
  /** Whether the client is driving the value. Spends the signal colour. */
  live: boolean;
  /** Qualifies the reading: the date it was taken, or `ago` once it counts. */
  note?: string;
  /** Widest form the reading takes, in characters. */
  width: number;
}

/**
 * The shared shape of a readout that upgrades itself on mount.
 *
 * Both live readings on `/stats` render this: a value the server could prove,
 * plus a note saying what it is qualified by. The note is the honest half —
 * without it the build-time age would read as the current age, and the build
 * date would read as an elapsed time.
 *
 * A fragment, not a wrapper: `.stat-table-value` already right-aligns and sets
 * the type, and the note has to be a block sibling rather than nested inside an
 * inline box.
 */
export default function Readout({
  elementRef,
  initial,
  live,
  note,
  width,
}: ReadoutProps) {
  return (
    <>
      <span
        className="stat-readout-value"
        data-live={live}
        ref={elementRef}
        // Reserved in `ch` for the widest form the reading takes, so upgrading
        // the precision cannot resize the cell it sits in. Derived from the
        // strings themselves rather than typed as a length.
        style={{ '--readout-width': `${width}ch` } as CSSProperties}
      >
        {initial}
      </span>
      {note ? <span className="stat-readout-note">{note}</span> : null}
    </>
  );
}
