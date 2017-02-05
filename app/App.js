import React, { PropTypes } from 'react';

import Header from './components/Template/Header';
import Nav from './components/Template/Nav';

const App = ({ children }) => (
  <div id="wrapper">
    <Header />
    <div id="main">
      {children}
    </div>
    <Nav />
  </div>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

App.defaultProps = {
  children: null,
};

export default App;
