import React from 'react';

import { TableBody, Table as UITable } from '@/components/ui/table';

import TableRow from './TableRow';
import { TableProps } from './types';

const Table: React.FC<TableProps> = ({ data }) => (
  <div className="glass rounded-lg overflow-hidden">
    <UITable className="backdrop-blur-sm">
      <TableBody>
        {data.map((pair) => (
          <TableRow
            format={pair.format}
            key={pair.label}
            label={pair.label}
            link={pair.link}
            value={pair.value}
          />
        ))}
      </TableBody>
    </UITable>
  </div>
);

export default Table;
