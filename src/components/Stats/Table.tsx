import React from 'react';

import TableRow from './TableRow';
import { TableProps } from './types';

const Table: React.FC<TableProps> = ({ data }) => (
  <table>
    <caption className="sr-only">Statistics table</caption>
    <thead className="sr-only">
      <tr>
        <th scope="col">Metric</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody>
      {data.map((pair) => (
        <TableRow
          format={pair.format}
          key={pair.label}
          label={pair.label}
          link={pair.link}
          value={pair.value}
        />
      ))}
    </tbody>
  </table>
);

export default Table;
