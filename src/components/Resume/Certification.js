import React from 'react';
import PropTypes from 'prop-types';

import Certidegree from './Certification/Certidegree';

const Cerification = ({ data }) => (
  <div className="education">
    <div className="link-to" id="education" />
    <div className="title">
      <h3>Education</h3>
    </div>
    {data.map((certidegree) => (
      <Certidegree
        data={certidegree}
        key={certidegree.school}
      />
    ))}
  </div>
);

Cerification.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    school: PropTypes.string,
    certidegree: PropTypes.string,
    link: PropTypes.string,
    year: PropTypes.number,
  })),
};

Cerification.defaultProps = {
  data: [],
};

export default Cerification;
