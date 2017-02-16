import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import Header from './components/Template/Header';

const FullPage = ({ children }) => (
  <div id="wrapper">
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
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
