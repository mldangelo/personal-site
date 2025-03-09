import React from 'react';
import PropTypes from 'prop-types';
import Job from './Experience/Job';

const Experience = ({ data }) => (
  <section className="experience">
    <div className="link-to" id="experience" />
    <header className="title">
      <h3>Experience</h3>
    </header>
    {data.length > 0 ? (
      data.map((job) => <Job data={job} key={`${job.name}-${job.position}`} />)
    ) : (
      <p>No experience available.</p>
    )}
  </section>
);

Experience.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      url: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string,
      summary: PropTypes.string,
      highlights: PropTypes.arrayOf(PropTypes.string),
      projects: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          startDate: PropTypes.string,
          endDate: PropTypes.string,
          summary: PropTypes.string,
          highlights: PropTypes.arrayOf(PropTypes.string),
        }),
      ),
    }),
  ).isRequired,
};

export default Experience;
