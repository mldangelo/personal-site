import React from 'react';
import PropTypes from 'prop-types';

import Degree from './Education/Degree';

const Education = ({ data }) => (
  <div className="education">
    <div className="link-to" id="education" /> {/* for in-page navigation */}
    <div className="title">
      <h3>Education</h3>
    </div>
    {data.map((degree) => (
      <Degree
        data={degree}
        key={`${degree.institution}${degree.area}`}
      />
    ))}
  </div>
);

// TODO Consider generating types from:
// https://github.com/jsonresume/resume-schema/blob/master/schema.json
// using https://www.npmjs.com/package/json-schema-to-typescript

Education.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    institution: PropTypes.string,
    url: PropTypes.string,
    area: PropTypes.string,
    studyType: PropTypes.string,
    startDate: PropTypes.string, // ex 2016-08-01 TODO enforce ISO 8601
    endDate: PropTypes.string,
    score: PropTypes.string, // GPA
  })),
};

Education.defaultProps = {
  data: [],
};

export default Education;
