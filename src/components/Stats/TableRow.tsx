import React, { isValidElement } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TableRow as ShadcnTableRow, TableCell } from '@/components/ui/table';

import { TableRowProps } from './types';

const TableRow: React.FC<TableRowProps> = ({ label, link = null, value = null, format, icon }) => {
  // If value is a React element, render it directly
  const displayValue = isValidElement(value) ? value : format ? format(value) : String(value);

  return (
    <ShadcnTableRow className="hover:bg-muted/50 transition-colors duration-150 border-b border-border/30 last:border-0">
      <TableCell className="w-[70%] font-medium text-foreground py-3">
        <div className="flex items-center gap-3">
          {icon && <FontAwesomeIcon icon={icon} className="w-4 h-4 text-accent" />}
          {label}
        </div>
      </TableCell>
      <TableCell className="text-right py-3">
        {link ? (
          <a
            href={link}
            className="text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
          >
            {displayValue}
          </a>
        ) : (
          <span className="text-foreground-bold font-medium">{displayValue}</span>
        )}
      </TableCell>
    </ShadcnTableRow>
  );
};

export default TableRow;
