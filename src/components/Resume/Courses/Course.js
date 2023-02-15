import React from 'react';
import PropTypes from 'prop-types';

const Course = ({ data, last }) => (
  <li className="course-container">
    <a href={data.link}>
      {
        (() => {
          if (data.university === 'Berkeley') {
            return (
              <img src="images/logos/Cal_logo.png" alt="University of California Berkeley" className="institution-logo" />
            );
          }
          if (data.university === 'Harvard Buisness School') {
            return (
              <img src="images/logos/HBS_logo.png" alt="Harvard Buisness School" className="institution-logo" />
            );
          }
          if (data.university === 'MIT') {
            return (
              <img src="images/logos/MIT_logo.png" alt="Massachusetts Institute of Technology" className="institution-logo" />
            );
          }
          return (
            <img src="images/logos/IACS_logo.png" alt="Harvard Institute for Applied Computational Science" className="institution-logo" />
          );
        })()
      }
      <h4 className="course-number">{data.number}:</h4>
      <p className="course-name">{data.title}</p>
    </a>
    {!last && <div className="course-dot"><p className="course-name"> &#8226;</p></div>}
  </li>
);

Course.propTypes = {
  data: PropTypes.shape({
    link: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    university: PropTypes.string.isRequired,
  }).isRequired,
  last: PropTypes.bool,
};

Course.defaultProps = {
  last: false,
};

export default Course;
