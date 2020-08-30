import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Certification from './Certifications/Certification';

const Certifications = ({ data }) => (
  <div className="certifications">
    <div className="link-to" id="certifications" />
    <div className="title">
      <h3>Certifications</h3>
    </div>
    <div className="certification-badges">
      {data.map((certification) => (
        <Certification
          data={certification}
          key={certification.name}
        />
      ))}
      <Helmet>
        <script type="text/javascript" async src="//cdn.youracclaim.com/assets/utilities/embed.js" />
      </Helmet>
    </div>
  </div>
);

Certifications.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })),
};

Certifications.defaultProps = {
  data: [],
};


export default Certifications;
