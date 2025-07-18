import React from 'react';

import type { Degree as DegreeType } from '@/data/resume/degrees';

import Degree from './Education/Degree';

interface EducationProps {
  data: DegreeType[];
}

const Education: React.FC<EducationProps> = ({ data }) => (
  <div className="space-y-6">
    {data.map((degree, index) => (
      <div
        key={degree.school}
        className="animate-fade-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Degree data={degree} />
      </div>
    ))}
  </div>
);

export default Education;
