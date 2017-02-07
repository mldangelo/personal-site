import React from 'react';

import Course from './Courses/Course';
import courses from '../../data/courses';

const getRows = () => {
  const ordered = courses.sort((a, b) => {
    let ret = 0;
    if (a.university > b.university) ret = -1;
    else if (a.unversity < b.university) ret = 1;
    else if (a.number > b.number) ret = 1;
    else if (a.number < b.number) ret = -1;
    return ret;
  })
  
  const rows = ordered.map(course => (
    <Course
      data={course}
      key={course.title}
    />
  ));
    
  // Remove dot after last course
  const lastidx = ordered.length - 1;
  rows[lastidx] = (
    <Course
      data={ordered[lastidx]}
      key={ordered[lastidx].title}
      last
    />
  );
  return rows;
};

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
