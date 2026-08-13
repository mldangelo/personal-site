'use client';

import { resolveReadings } from '@/lib/readings';

import declarations from '../../data/stats/personal';
import Table from './Table';

// Resolved once, at module scope. The age readout writes itself into a text
// node out of band rather than through React state, so ticking the age does not
// trigger a component re-render.
const readings = resolveReadings(declarations);

export default function PersonalStats() {
  return (
    <>
      <Table data={readings} />
      <p className="stats-source-note" data-source="profile">
        Profile readings come from the site&apos;s maintained profile data. The
        age is computed in your browser from the recorded birth instant.
      </p>
    </>
  );
}
