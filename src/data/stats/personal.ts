import type { StatDeclaration } from '@/lib/readings';
import { COUNTRIES_VISITED, CURRENT_CITY } from '@/lib/telemetry';

/**
 * Facts typed into `src/data/profile.json`, apart from the age, which is
 * computed from the birth instant there.
 *
 * `age` declares a key and no value. This file used to carry a `'use client'`
 * directive so it could hold the live readout as a React element, which dragged
 * the declarations, `resolveReadings`, `Table`, and `TableRow` into the client
 * bundle behind it. The element is supplied by
 * `src/components/Stats/Personal.tsx` now, because the reading the server can
 * render depends on when the build ran and only the renderer knows that.
 */
const data: StatDeclaration[] = [
  {
    key: 'age',
    label: 'Current age',
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
