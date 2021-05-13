import React from 'react';
import PropTypes from 'prop-types';

const Certidegree = ({ data }) => (
  <article className="degree-container">
    <header>
      <h4 className="degree">{data.certidegree}</h4>
      <p className="school"><a href={data.link}>{data.school}</a>, {data.year}</p>
    </header>
  </article>
);

Certidegree.propTypes = {
  data: PropTypes.shape({
    certidegree: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

export default Certidegree;
