import React from 'react';
import PropTypes from 'prop-types';

const getPoints = data => data.points.map(point => (
  <li key={point}>{point}</li>
));

const Job = props => (
  <article className="jobs-container">
    <header>
      <h4><a href={props.data.link}>{props.data.company}</a> - {props.data.position}</h4>
      <p className="daterange"> {props.data.daterange}</p>
    </header>
    <ul className="points">
      {getPoints(props.data)}
    </ul>
  </article>
);

Job.propTypes = {
  data: PropTypes.shape({
    link: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    daterange: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Job;
