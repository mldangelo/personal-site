import type { ReactElement } from 'react';

import type { Reading, ReadingSource } from '@/lib/readings';

export type { Reading, ReadingSource, StatDeclaration } from '@/lib/readings';

/**
 * `TableRow` is the dumb renderer, so it stays tolerant of raw values. It
 * deliberately no longer takes a `format` function: formatting happens in
 * `resolveReadings` before the row reaches a table, which is what lets the
 * server table pass its rows across the RSC boundary at all.
 *
 * It takes no source either. Where a reading came from is said once, by the
 * caption of the table the row sits in.
 */
export interface TableRowProps {
  label: string;
  link?: string | null;
  value?: ReactElement | number | string | boolean | null;
}

export interface TableProps {
  /** Where every reading in this table came from, as a reader is told it. */
  caption: string;
  data: readonly Reading[];
  /**
   * The same fact for the stylesheet and for anything reading the markup.
   * `fallback` is a GitHub table whose numbers this build could not fetch.
   */
  source?: ReadingSource | 'fallback';
}
