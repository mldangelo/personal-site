import React from 'react';

import Job from './Experience/Job';
import positions from './data/positions';

const getRows = () => positions.map(job => (
  <Job
    data={job}
    key={job.company}
  />
));

const Experience = () => (
  <div className="experience">
    <div className="title">
      <h3>Experience</h3>
    </div>
    {getRows()}
  </div>
);

export default Experience;
