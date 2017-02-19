import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';

const Main = ({ children }) => (
  <div id="wrapper">
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
    <Header />
    <div id="main">
      {children}
    </div>
    <Nav />
  </div>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Main.defaultProps = {
  children: null,
};

export default Main;
