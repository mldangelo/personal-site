import React, { PropTypes } from 'react';

import Header from '../components/Template/Header';

const FullPage = ({ children }) => (
  <div id="wrapper">
    <Header />
    <div id="main">
      {children}
    </div>
  </div>
);

FullPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

FullPage.defaultProps = {
  children: null,
};

export default FullPage;
