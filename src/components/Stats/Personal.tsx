'use client';

import React from 'react';

import data from '../../data/stats/personal';
import Table from './Table';

const PersonalStats: React.FC = () => (
  <div className="mb-8">
    <h3 className="text-2xl font-heading font-heading-bold uppercase tracking-heading mb-4">
      Some stats about me
    </h3>
    <Table data={data} />
  </div>
);

export default PersonalStats;
