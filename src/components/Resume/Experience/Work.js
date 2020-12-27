import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// TODO think about conditional schema validation - if start exists, so should end.
const formatDate = (dateString) => {
  const date = dayjs(dateString);
  return date.isValid() ? date.format('MMMM YYYY') : 'present';
};

const Work = ({ data }) => (
  <article className="jobs-container">
    <header>
      <h4><a href={data.url}>{data.name}</a> - {data.position}</h4>
      <p className="daterange"> {formatDate(data.startDate)} - {formatDate(data.endDate)}</p>
    </header>
    <ul className="points">
      {data.highlights.map((highlight) => (
        <li key={highlight}>{highlight}</li>
      ))}
    </ul>
  </article>
);

Work.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string, // Company Name
    location: PropTypes.string,
    description: PropTypes.string, // Company description
    position: PropTypes.string,
    url: PropTypes.string,
    startDate: PropTypes.string, // Iso8601
    endDate: PropTypes.string, // Iso8601
    summary: PropTypes.string, // Overview of your responsibilities at the company
    highlights: PropTypes.arrayOf(PropTypes.string), // Specify multiple accomplishments
  }).isRequired,
};

export default Work;
