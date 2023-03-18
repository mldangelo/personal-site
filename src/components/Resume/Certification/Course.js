import React from 'react';
import PropTypes from 'prop-types';

const Course = ({ data }) => (
  <article className="jobs-container">
    <header>
      <h4>
        <a href={data.link}>{data.name}</a> - {data.source}
      </h4>
      <p className="daterange"> Issued {data.issuedDate}</p>
    </header>
  </article>
);

Course.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    issuedDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default Course;
