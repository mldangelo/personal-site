'use client';

import React from 'react';

import type { Position } from '@/data/resume/work';

import Job from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

const Experience: React.FC<ExperienceProps> = ({ data }) => {
  return (
    <div className="w-full">
      {data.map((job) => (
        <Job data={job} key={`${job.name}-${job.position}`} />
      ))}
    </div>
  );
};

export default Experience;
