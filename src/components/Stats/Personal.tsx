'use client';

import { resolveReadings } from '@/lib/readings';

import declarations from '../../data/stats/personal';
import Table from './Table';

// Resolved once, at module scope: the age readout writes itself into a text
// node out of band rather than through React state, so this component is never
// re-rendered and there is nothing to memoize.
const readings = resolveReadings(declarations);

export default function PersonalStats() {
  return (
    <>
      <Table data={readings} />
      <p className="stats-source-note" data-source="profile">
        Profile readings come from src/data/profile.json. The age is computed in
        your browser from the birth instant recorded there.
      </p>
    </>
  );
}
