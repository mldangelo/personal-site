import React from 'react';
import PropTypes from 'prop-types';

const parse = require('html-react-parser');

const Certification = ({ data }) => (
  <article className="certification">
    <div>
      {parse(data.content)}
    </div>
    <header>
      <p className="daterange"> {data.date}</p>
    </header>
  </article>
);

Certification.propTypes = {
  data: PropTypes.shape({
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Certification;
