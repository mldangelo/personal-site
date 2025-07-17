import React from 'react';

import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
  last?: boolean;
}

const Course: React.FC<CourseProps> = ({ data, last = false }) => (
  <li className="course-container">
    <a href={data.link}>
      <h4 className="course-number">{data.number}:</h4>
      <p className="course-name">{data.title}</p>
    </a>
    {!last && (
      <div className="course-dot">
        <p className="course-name"> &#8226;</p>
      </div>
    )}
  </li>
);

export default Course;
