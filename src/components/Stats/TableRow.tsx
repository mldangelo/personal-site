import type React from 'react';
import type { TableData } from '../../types';

type TableRowProps = Omit<TableData, 'key' | 'value'> & {
  value: TableData['value'];
  format?: (value: TableData['value']) => JSX.Element | number | string;
};

const TableRow: React.FC<TableRowProps> = ({ label, link, value, format = (x) => x }) => (
  <tr>
    <td width="70%">{label}</td>
    <td>{link ? <a href={link}>{format(value)}</a> : format(value)}</td>
  </tr>
);

export default TableRow;
