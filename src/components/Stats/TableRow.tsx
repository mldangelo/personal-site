import type { ReactElement } from 'react';

export interface StatRow {
  label: string;
  value: ReactElement | string;
  /** Where the value points. */
  link?: string;
}

/**
 * The most characters a value can run to and still be sure of fitting beside
 * its label on the narrowest phone.
 *
 * A value is one token and never breaks, which is what lets its column hug the
 * widest value and leave the label everything else. The tightest row is
 * "Lines of TypeScript powering this site": its longest word cannot break,
 * and on a 320px screen that leaves room for 17 characters of value. A longer
 * one runs past the right rail. Nothing this site publishes comes close, but a
 * fork's city may not fit. The limit applies to every row, so the tightest one
 * sets it.
 */
const LONGEST_UNBROKEN_VALUE = 17;

export default function TableRow({ label, link, value }: StatRow) {
  const breakable =
    typeof value === 'string' && value.length > LONGEST_UNBROKEN_VALUE;

  // The label names its row, so it is a row header rather than a data cell —
  // that is what lets a screen reader announce the value with its label.
  return (
    <tr>
      <th scope="row" className="stat-table-label">
        {label}
      </th>
      <td
        className={
          breakable
            ? 'stat-table-value stat-table-value--long'
            : 'stat-table-value'
        }
      >
        {link ? (
          <a className="stat-table-link" href={link}>
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    </tr>
  );
}
