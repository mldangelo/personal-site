import type { ReactElement } from 'react';

import type { Reading } from '@/lib/readings';

export type { Reading, StatDeclaration } from '@/lib/readings';

/**
 * `TableRow` is the dumb renderer, so it stays tolerant of raw values. It
 * deliberately takes no `format` function: formatting happens in
 * `resolveReadings` before the row reaches a table, which is what lets the
 * server table pass its rows across the RSC boundary at all.
 */
export interface TableRowProps {
  label: string;
  link?: string | null;
  value?: ReactElement | number | string | boolean | null;
}

export interface TableProps {
  data: readonly Reading[];
}
