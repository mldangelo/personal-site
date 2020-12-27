import React from 'react';
import PropTypes from 'prop-types';

const ReducedCourse = ({ data, last }) => (
  <li className="course-container">
    <p className="course-number">{data}:</p>
    {!last && <div className="course-dot"><p className="course-name"> &#8226;</p></div>}
  </li>
);

ReducedCourse.propTypes = {
  data: PropTypes.string.isRequired,
  last: PropTypes.bool,
};

ReducedCourse.defaultProps = {
  last: false,
};

export default ReducedCourse;
