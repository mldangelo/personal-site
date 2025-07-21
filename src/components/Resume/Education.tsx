import React from 'react';

import type { Degree as DegreeType } from '@/data/resume/degrees';

import Degree from './Education/Degree';

interface EducationProps {
  data: DegreeType[];
}

const Education: React.FC<EducationProps> = ({ data }) => (
  <div className="space-y-6">
    {data.map((degree) => (
      <Degree key={degree.school} data={degree} />
    ))}
  </div>
);

export default Education;
