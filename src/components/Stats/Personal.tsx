'use client';

import React from 'react';
import Table from './Table';
import data from '../../data/stats/personal';

const PersonalStats: React.FC = () => (
  <>
    <h3>Some stats about me</h3>
    <Table data={data} />
  </>
);

export default PersonalStats;