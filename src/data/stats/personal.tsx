'use client';

import useLiveAge from '@/hooks/useLiveAge';
import type { StatDeclaration } from '@/lib/readings';
import {
  AGE_PRECISION_FULL,
  agePlaceholder,
  COUNTRIES_VISITED,
  CURRENT_CITY,
} from '@/lib/telemetry';

/**
 * The stats page reports age at deliberately absurd precision.
 *
 * The placeholder is the rendered content; `useLiveAge` writes the reading into
 * this node directly, so the ticking never re-renders React.
 */
function Age() {
  const ref = useLiveAge<HTMLSpanElement>(AGE_PRECISION_FULL);

  return (
    <span className="stat-live" ref={ref}>
      {agePlaceholder(AGE_PRECISION_FULL)}
    </span>
  );
}

/**
 * All three are `source: 'profile'`: they are facts typed into
 * `src/data/profile.json`, not counted from anything. The age readout is
 * computed rather than typed, but the datum it is computed from — the birth
 * instant — is still a profile entry, and that is what the mark is telling the
 * reader.
 *
 * No `unit` on the countries count: `53 countries` beside `Countries visited`
 * says nothing the label has not already said.
 */
const data: StatDeclaration[] = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age />,
    source: 'profile',
  },
  {
    key: 'countries',
    label: 'Countries visited',
    value: COUNTRIES_VISITED,
    source: 'profile',
    link: 'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
  },
  {
    key: 'location',
    label: 'Current city',
    value: CURRENT_CITY,
    source: 'profile',
  },
];

export default data;
