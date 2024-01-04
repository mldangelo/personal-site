import React from 'react';
import PropTypes from 'prop-types';

const Degree = ({ data }) => (
  <article className="degree-container">
    <header>
      <h4 className="degree"><a href={data.dlink}>{data.degree}</a></h4>
      <p className="school"><a href={data.link}>{data.school}</a>, {data.startYear} - {data.endYear}</p>
    </header>
  </article>
);

Degree.propTypes = {
  data: PropTypes.shape({
    degree: PropTypes.string.isRequired,
    dlink: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    startYear: PropTypes.number.isRequired,
    endYear: PropTypes.number.isRequired,
  }).isRequired,
};

export default Degree;
