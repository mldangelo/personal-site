import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Analytics from '../components/Template/Analytics';
import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';
import ScrollToTop from '../components/Template/ScrollToTop';

const Main = (props) => (
  <>
    <Analytics />
    <ScrollToTop />
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
    <div id="wrapper">
      <Header />
      <div id="main">
        {props.children}
      </div>
      {props.fullPage ? null : <Nav />}
    </div>
  </>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
};

export default Main;
