import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';

const Main = props => (
  <div id="wrapper">
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
    <Header />
    <div id="main">
      {props.children}
    </div>
    {props.fullPage ? '' : <Nav />}
  </div>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.boolean,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
};

export default Main;
