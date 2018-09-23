import React from 'react';
import PropTypes from 'prop-types';
// TODO remove last bullet / figure out how to add bullets with css

const Course = props => (
  <li className="course-container">
    <a href={props.data.link}>
      <h4 className="course-number">{props.data.number}:</h4>
      <p className="course-name">{props.data.title}</p>
    </a>
    {props.last ? null : <div className="course-dot"><p className="course-name"> &#8226;</p></div>}
  </li>
);

Course.propTypes = {
  data: PropTypes.shape({
    link: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  last: PropTypes.bool,
};

Course.defaultProps = {
  last: false,
};


export default Course;
