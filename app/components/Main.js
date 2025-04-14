'use client';

import PropTypes from 'prop-types';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Import from new component locations
import Analytics from './Template/Analytics';
import Navigation from './Template/Navigation';
import ScrollToTop from './Template/ScrollToTop';
import SideBar from './Template/SideBar';

const Main = (props) => (
  <HelmetProvider>
    <Analytics />
    <ScrollToTop />
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" defer={false}>
      {props.title && <title>{props.title}</title>}
      <meta name="description" content={props.description} />
    </Helmet>
    <div id="wrapper">
      <Navigation />
      <div id="main">{props.children}</div>
      {props.fullPage ? null : <SideBar />}
    </div>
  </HelmetProvider>
);

Main.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
  title: null,
  description: "Michael D'Angelo's personal website.",
};

export default Main;
