import { isValidElement } from 'react';

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

  return (
    <tr>
      <td className="stat-table-label">{label}</td>
      <td className="stat-table-value">
        {link ? <a href={link}>{displayValue}</a> : displayValue}
      </td>
    </tr>
  );
}
