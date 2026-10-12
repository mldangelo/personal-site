import { isValidElement } from 'react';

import type { TableRowProps } from './types';

/**
 * The most characters a value can run to and still be sure of fitting beside
 * its label on the narrowest phone.
 *
 * A value is one token and never breaks, which is what lets its column hug the
 * widest value and leave the label everything else. At 18px mono a character
 * is 10.8px, and on a 320px screen the profile table has 197px left for a
 * value once its labels have wrapped as far as they will. A longer one runs
 * past the right rail, and a 26-character city took the page 60px sideways.
 * Nothing this site publishes comes close, but the city is free text, and a
 * fork's may not fit.
 */
const LONGEST_UNBROKEN_VALUE = 18;

export default function TableRow({
  label,
  link = null,
  value = null,
}: TableRowProps) {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value) ? value : String(value);
  const breakable =
    typeof displayValue === 'string' &&
    displayValue.length > LONGEST_UNBROKEN_VALUE;

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
            {displayValue}
          </a>
        ) : (
          displayValue
        )}
      </td>
    </tr>
  );
}
