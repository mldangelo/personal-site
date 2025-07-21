import React, { isValidElement } from 'react';

import { TableRow as ShadcnTableRow, TableCell } from '@/components/ui/table';

import { TableRowProps } from './types';

const TableRow: React.FC<TableRowProps> = ({ label, link = null, value = null, format }) => {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value) ? value : format ? format(value) : String(value);

  return (
    <ShadcnTableRow className="border-b border-gray-200 dark:border-gray-800 last:border-0">
      <TableCell className="py-3 text-sm">{label}</TableCell>
      <TableCell className="text-right py-3 text-sm">
        {link ? (
          <a href={link} className="hover:underline">
            {displayValue}
          </a>
        ) : (
          <span>{displayValue}</span>
        )}
      </TableCell>
    </ShadcnTableRow>
  );
};

export default TableRow;
