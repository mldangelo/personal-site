import React from 'react';
import { Link } from 'react-router-dom';

const { BASE_PATH } = process.env; // base url, usually ''

const References = () => (
  <div className="references">
    <div className="link-to" id="references" />
    <div className="title">
      <Link to={`${BASE_PATH}/contact`}>
        <h3>References are available upon request</h3>
      </Link>
    </div>
  </div>
);

export default References;
