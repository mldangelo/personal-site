'use client';

import React from 'react';

import data from '../../data/stats/personal';
import Table from './Table';

const PersonalStats: React.FC = () => <Table data={data} />;

export default PersonalStats;
