import React from 'react';
import PropTypes from 'prop-types';

const Degree = ({ data }) => (
  <article className="degree-container">
    <header>
      <h4 className="degree">{data.degree}</h4>
      <p className="school"><a href={data.link} style={{ color: data.color }}>{data.school}</a>, {data.year}, GPA: {data.gpa}</p>
    </header>
  </article>
);

Degree.propTypes = {
  data: PropTypes.shape({
    degree: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    gpa: PropTypes.string,
  }),
};

Degree.defaultProps = {
  data: {
    gpa: 'N/A',
  },
};

export default Degree;
