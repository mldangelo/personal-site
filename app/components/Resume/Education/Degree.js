import React, { PropTypes } from 'react';

const Degree = (props) => (
  <article>
    <header>
      <p className="degree">{props.data.degree}</p>
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
  }),
};

export default Degree;
