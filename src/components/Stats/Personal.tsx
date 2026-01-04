'use client';

import data from '../../data/stats/personal';
import Table from './Table';

export default function PersonalStats() {
  return <Table data={data} />;
}
