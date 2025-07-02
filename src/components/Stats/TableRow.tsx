import React from 'react';
import { TableRowProps } from './types';

const TableRow: React.FC<TableRowProps> = ({
  label, 
  link = null, 
  value = null, 
  format = (x) => x,
}) => (
  <tr>
    <td width="70%">{label}</td>
    <td>{link ? <a href={link}>{format(value)}</a> : format(value)}</td>
  </tr>
);

export default TableRow;