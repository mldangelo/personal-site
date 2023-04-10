import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Job = ({ data }) => (
  <article className="jobs-container">
    <header>
      <h4><a href={data.url}>{data.name}</a> - {data.position}</h4>
      <p className="daterange"> {dayjs(data.startDate).format('MMMM YYYY')} - {dayjs(data.endDate).format('MMMM YYYY') ?? 'Present'}</p>
    </header>
    <ul className="points">
      {data.highlights.map((highlight) => (
        <li key={highlight}>{highlight}</li>
      ))}
    </ul>
  </article>
);

Job.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    summary: PropTypes.string,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Job;
