import { ReactElement } from 'react';

export interface StatData {
  key?: string;
  label: string;
  value?: ReactElement | number | string | boolean;
  link?: string;
  format?: (value: unknown) => string | ReactElement;
}

export interface TableRowProps {
  label: string;
  link?: string | null;
  value?: ReactElement | number | string | boolean | null;
  format?: (value: unknown) => string | ReactElement;
}

export interface TableProps {
  data: StatData[];
}
