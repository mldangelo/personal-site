import React from 'react';
import PropTypes from 'prop-types';

import Course from './Courses/Course';

const getRows = (courses, university) => {
  const filtered = courses.filter((course) => course.university === university);
  return filtered.sort((a, b) => a.title > b.title).map((course, idx) => (
    <Course
      data={course}
      key={course.title}
      last={idx === filtered.length - 1}
    />
  ));
};

const Courses = ({ data }) => (
  <div className="courses">
    <div className="link-to" id="courses" />
    <div className="title">
      <h3>Selected Courses</h3>
    </div>
    <div className="title">
      <h4>MSc. Computer Science (KTH)</h4>
    </div>
    <ul className="course-list">
      {getRows(data, 'KTH')}
    </ul>
    <div className="title">
      <h4>MSc. Simulation and Visualization (NTNU)</h4>
    </div>
    <ul className="course-list">
      {getRows(data, 'NTNU')}
    </ul>
    <div className="title">
      <h4>BSc. Computer Science (FU)</h4>
    </div>
    <ul className="course-list">
      {getRows(data, 'FU')}
    </ul>
    <div className="title">
      <h4>Other</h4>
    </div>
    <ul className="course-list">
      {getRows(data, 'TU')}
    </ul>
  </div>
);

Courses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    number: PropTypes.string,
    dlink: PropTypes.string,
    link: PropTypes.string,
    university: PropTypes.string,
  })),
};

Courses.defaultProps = {
  data: [],
};

export default Courses;
