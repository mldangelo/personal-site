import React from 'react';
import PropTypes from 'prop-types';

import Job from './Experience/Job';

const getRows = positions => positions.map(job => (
  <Job
    data={job}
    key={job.company}
  />
));

const Experience = props => (
  <div className="experience">
    <div className="link-to" id="experience" />
    <div className="title">
      <h3>Experience</h3>
    </div>
    {getRows(props.data)}
  </div>
);

Experience.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string,
    position: PropTypes.string,
    link: PropTypes.string,
    daterange: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.string),
  })),
};

Experience.defaultProps = {
  data: [],
};


export default Experience;
