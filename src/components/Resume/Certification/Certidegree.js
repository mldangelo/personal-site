import React from 'react';
import PropTypes from 'prop-types';

const Certidegree = ({ data }) => (
  <article className="certidegree-container">
    {/* <ul className="points">
      {data.points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul> */}
    <li style={{ listStyleType: 'square' }}>
      <a href={data.link}>{data.certidegree} </a>by {data.university}
    </li>
  </article>
);

Certidegree.propTypes = {
  data: PropTypes.shape({
    certidegree: PropTypes.string,
    link: PropTypes.string,
    university: PropTypes.string,
  }).isRequired,
};

export default Certidegree;
