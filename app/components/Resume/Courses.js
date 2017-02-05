import React from 'react';

import _orderBy from 'lodash/orderBy';

import Course from './Courses/Course';
import courses from './data/courses';

const getRows = () => {
  const ordered = _orderBy(courses, ['univerity', 'number'], ['desc', 'asc']);
  const rows = ordered.map(course => (
    <Course
      data={course}
      key={course.title}
    />));
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
      <ul>
        {getRows()}
      </ul>
    </div>
  </article>
);

export default Courses;
