import React from 'react';

import { TableBody, Table as UITable } from '@/components/ui/table';

import TableRow from './TableRow';
import { TableProps } from './types';

const Table: React.FC<TableProps> = ({ data }) => (
  <div className="overflow-hidden rounded-xl glass glass-border glass-shadow">
    <UITable className="relative">
      <TableBody>
        {data.map((pair) => (
          <TableRow
            format={pair.format}
            key={pair.label}
            label={pair.label}
            link={pair.link}
            value={pair.value}
            icon={pair.icon}
          />
        ))}
      </TableBody>
    </UITable>
  </div>
);

export default Table;
