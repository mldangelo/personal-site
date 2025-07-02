import React from 'react';

import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
}

const Course: React.FC<CourseProps> = ({ data }) => (
  <li className="course-container">
    <a href={data.link}>
      <span className="course-number">{data.number}</span>
      <span className="course-name">{data.title}</span>
    </a>
  </li>
);

export default Course;
