import React from 'react';
import PropTypes from 'prop-types';

const Course = ({ data, last }) => {
  const isBerkeley = data.university === 'Berkeley';
  const isCommunityCollege = data.university === 'Community College';

  // Define styles based on the condition
  let color;
  if (isBerkeley) {
    color = 'navy';
  } else if (isCommunityCollege) {
    color = 'maroon';
  } else {
    color = 'pink';
  }

  const textStyles = {
    color,
  };

  return (
    <li className="course-container">
      <a href={data.link} style={textStyles}>
        <h4 className="course-number">{data.number}:</h4>
        <p className="course-name">{data.title}</p>
      </a>
      {!last && <div className="course-dot"><p className="course-name"> &#8226;</p></div>}
    </li>
  );
};

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
