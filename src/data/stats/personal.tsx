'use client';

import useLiveAge from '@/hooks/useLiveAge';
import {
  AGE_PRECISION_FULL,
  COUNTRIES_VISITED,
  CURRENT_CITY,
} from '@/lib/telemetry';

import type { StatData } from '../../components/Stats/types';

/** The stats page reports age at deliberately absurd precision. */
function Age() {
  const age = useLiveAge(AGE_PRECISION_FULL);

  return <span className="stat-live">{age}</span>;
}

const data: StatData[] = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age />,
  },
  {
    key: 'countries',
    label: 'Countries visited',
    value: COUNTRIES_VISITED,
    link: 'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
  },
  {
    key: 'location',
    label: 'Current city',
    value: CURRENT_CITY,
  },
];

export default data;
