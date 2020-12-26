import React from 'react';
import PropTypes from 'prop-types';

const Degree = ({ data }) => (
  <article className="degree-container">
    <header>
      <h4 className="degree">{data.studyType} {data.area}</h4>
      <p className="school"><a href={data.url}>{data.institution}</a>, {data.endDate}</p>
    </header>
  </article>
);

// TODO Consider generating types from:
// https://github.com/jsonresume/resume-schema/blob/master/schema.json
// using https://www.npmjs.com/package/json-schema-to-typescript

Degree.propTypes = {
  data: PropTypes.shape({
    institution: PropTypes.string,
    url: PropTypes.string,
    area: PropTypes.string,
    studyType: PropTypes.string,
    startDate: PropTypes.string, // ex 2016-08-01 TODO enforce ISO 8601
    endDate: PropTypes.string,
    score: PropTypes.string, // GPA
  }).isRequired,
};

export default Degree;
