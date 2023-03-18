import React from 'react';
import PropTypes from 'prop-types';

import Course from './Certification/Course';

const Certification = ({ data }) => (
  <div className="certification">
    <div className="link-to" id="certification" />
    <div className="title">
      <h3>Certifications</h3>
    </div>
    {data.map((course) => (
      <Course data={course} key={course.name} />
    ))}
  </div>
);

Certification.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      company: PropTypes.string,
      position: PropTypes.string,
      link: PropTypes.string,
      daterange: PropTypes.string,
      points: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

Certification.defaultProps = {
  data: [],
};

export default Certification;
