import { isValidElement } from 'react';

import { newTabProps } from '@/lib/links';

import type { TableRowProps } from './types';

export default function TableRow({
  label,
  link = null,
  value = null,
  format,
}: TableRowProps) {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value)
    ? value
    : format
      ? format(value)
      : String(value);

  // The label names its row, so it is a row header rather than a data cell —
  // that is what lets a screen reader announce the value with its label.
  return (
    <tr>
      <th scope="row" className="stat-table-label">
        {label}
      </th>
      <td className="stat-table-value">
        {link ? (
          <a href={link} {...newTabProps(link)}>
            {displayValue}
          </a>
        ) : (
          displayValue
        )}
      </td>
    </tr>
  );
}
