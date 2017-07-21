import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import ReactGA from 'react-ga';

import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-68649021-1');
}

class Main extends Component {
  componentWillMount() {
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.set({
        page: window.location.pathname,
        userId: window.id,
      });
      ReactGA.pageview(window.location.pathname);
    }
  }

  render() {
    return (
      <div id="wrapper">
        <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
        <Header />
        <div id="main">
          {this.props.children}
        </div>
        {this.props.fullPage ? null : <Nav />}
      </div>);
  }
}

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
