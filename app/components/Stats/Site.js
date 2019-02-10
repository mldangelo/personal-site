import React from 'react';

import Table from './Table';
import data from '../../data/github';

const Stats = () => (
  <div>
    <h3>Some stats about this site</h3>
    <Table
      data={data}
    />
  </div>
);

export default Stats;
