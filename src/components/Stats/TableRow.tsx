import React, { isValidElement } from 'react';

import { TableRowProps } from './types';

const TableRow: React.FC<TableRowProps> = ({ label, link = null, value = null, format }) => {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value) ? value : format ? format(value) : String(value);

  return (
    <tr>
      <td width="70%">{label}</td>
      <td>{link ? <a href={link}>{displayValue}</a> : displayValue}</td>
    </tr>
  );
};

export default TableRow;
