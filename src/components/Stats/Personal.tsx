'use client';

import React from 'react';

import data from '../../data/stats/personal';
import Table from './Table';

const PersonalStats: React.FC = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Personal</h2>
    <Table data={data} />
  </div>
);

export default PersonalStats;
