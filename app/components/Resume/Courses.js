import React from 'react';

import Course from './Courses/Course';
import courses from '../../data/courses';

const getRows = () => courses.sort((a, b) => {
  let ret = 0;
  if (a.university > b.university) ret = -1;
  else if (a.unversity < b.university) ret = 1;
  else if (a.number > b.number) ret = 1;
  else if (a.number < b.number) ret = -1;
  return ret;
}).map((course, idx) => (
  <Course
    data={course}
    key={course.title}
    last={idx === courses.length - 1}
  />
));

const Courses = () => (
  <article>
    <div className="courses">
      <div className="title">
        <h3>Selected Courses</h3>
      </div>
      <ul className="course-list">
        {getRows()}
      </ul>
    </div>
  </article>
);

export default Courses;
