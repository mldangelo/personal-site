import React from 'react';

import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
  last?: boolean;
}

const Course: React.FC<CourseProps> = ({ data, last = false }) => (
  <li className="flex items-center">
    <a
      href={data.link}
      className="flex items-center hover:text-accent transition-colors group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="font-bold text-foreground-bold group-hover:text-accent">{data.number}:</span>
      <span className="ml-1 text-foreground group-hover:text-accent">{data.title}</span>
    </a>
    {!last && <span className="mx-2 text-foreground-light">•</span>}
  </li>
);

export default Course;
