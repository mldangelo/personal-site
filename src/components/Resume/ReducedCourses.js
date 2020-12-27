import React from 'react';
import PropTypes from 'prop-types';

import ReducedCourse from './Courses/ReducedCourse';

const getRows = (courses) => courses.sort().map((course, idx) => (
  <ReducedCourse
    data={course}
    key={course}
    last={idx === courses.length - 1}
  />
));

const ReducedCourses = ({ data }) => (
  <div className="courses">
    <div className="link-to" id="courses" />
    <div className="title">
      <h3>Selected Courses</h3>
    </div>
    <ul className="course-list">
      {getRows(data)}
    </ul>
  </div>
);

ReducedCourses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
};

ReducedCourses.defaultProps = {
  data: [],
};

export default ReducedCourses;
