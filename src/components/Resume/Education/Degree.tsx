import React from 'react';

import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

const Degree: React.FC<DegreeProps> = ({ data }) => (
  <div className="mb-4">
    <h3 className="text-base font-semibold">{data.degree}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      <a href={data.link} className="hover:underline" target="_blank" rel="noopener noreferrer">
        {data.school}
      </a>
      {' – '}
      {data.year}
    </p>
  </div>
);

export default Degree;
