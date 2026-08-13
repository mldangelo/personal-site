import { isValidElement } from 'react';

import { SOURCE_LABELS } from '@/lib/readings';

import type { TableRowProps } from './types';

export default function TableRow({
  label,
  link = null,
  value = null,
  source,
}: TableRowProps) {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value) ? value : String(value);

  // The label names its row, so it is a row header rather than a data cell —
  // that is what lets a screen reader announce the value with its label. The
  // label text keeps its own element so the provenance mark can hang beneath
  // it without joining the header's text.
  return (
    <tr>
      <th scope="row" className="stat-table-label">
        <span className="stat-table-label-text">{label}</span>
        {source ? (
          <span className="stat-provenance" data-source={source}>
            <span className="sr-only">Source: </span>
            {SOURCE_LABELS[source]}
          </span>
        ) : null}
      </th>
      <td className="stat-table-value">
        {link ? <a href={link}>{displayValue}</a> : displayValue}
      </td>
    </tr>
  );
}
