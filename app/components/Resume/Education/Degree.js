import React from 'react';
import PropTypes from 'prop-types';

const Degree = props => (
  <article className="degree-container">
    <header>
      <h4 className="degree">{props.data.degree}</h4>
      <p className="school"><a href={props.data.link}>{props.data.school}</a>, {props.data.year}</p>
    </header>
  </article>
);

Degree.propTypes = {
  data: PropTypes.shape({
    degree: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

export default Degree;
