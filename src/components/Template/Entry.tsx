import type { ReactNode } from 'react';

interface EntryProps {
  /** Left-column dateline, e.g. "2026—" or "2019". */
  period: ReactNode;
  children: ReactNode;
}

/**
 * A ledger row: dateline in a fixed left column, content on the right,
 * separated from its neighbours by a hairline. Collapses to a single stacked
 * column on narrow screens, where the 104px gutter costs more than it earns.
 */
const Entry = ({ period, children }: EntryProps) => (
  <article className="grid grid-cols-1 gap-2 border-t border-rule py-6 first:border-t-0 sm:grid-cols-[104px_1fr] sm:gap-6">
    <div className="pt-1 font-mono text-[0.76rem] text-faint">{period}</div>
    <div>{children}</div>
  </article>
);

export default Entry;
