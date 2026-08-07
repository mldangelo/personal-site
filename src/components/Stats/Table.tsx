import type React from 'react';
import TableRow from './TableRow';

export interface ITableData {
  label: string;
  key?: string;
  link?: string;
  value?: string | React.ReactNode;
  format?: (date: string | React.ReactNode) => string;
}

export interface ITable {
  data: ITableData[];
}

const Table = (data: ITable) => (
  <table className="w-full">
    <tbody>
      {data.data.map((pair: ITableData) => (
        <TableRow
          key={pair.key}
          label={pair.label}
          link={pair.label}
          value={pair.value}
          format={pair.format}
        />
      ))}
    </tbody>
  </table>
);

export default Table;
