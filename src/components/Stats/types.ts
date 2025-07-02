import { ReactElement } from 'react';

export interface StatData {
  key?: string;
  label: string;
  value?: ReactElement | number | string;
  link?: string;
  format?: (value: any) => string | ReactElement;
}

export interface TableRowProps {
  label: string;
  link?: string | null;
  value?: ReactElement | number | string | null;
  format?: (value: any) => string | ReactElement;
}

export interface TableProps {
  data: StatData[];
}