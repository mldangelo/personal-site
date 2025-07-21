import React from 'react';

import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
  last?: boolean;
}

const Course: React.FC<CourseProps> = ({ data, last = false }) => (
  <li className="inline">
    <a
      href={data.link}
      className="hover:underline text-sm"
      target="_blank"
      rel="noopener noreferrer"
    >
      {data.number}: {data.title}
    </a>
    {!last && <span className="mx-2 text-gray-400">•</span>}
  </li>
);

export default Course;
