import { ReactElement } from 'react';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StatData {
  key?: string;
  label: string;
  value?: ReactElement | number | string | boolean;
  link?: string;
  format?: (value: unknown) => string | ReactElement;
  icon?: IconDefinition;
}

export interface TableRowProps {
  label: string;
  link?: string | null;
  value?: ReactElement | number | string | boolean | null;
  format?: (value: unknown) => string | ReactElement;
  icon?: IconDefinition;
}

export interface TableProps {
  data: StatData[];
}
