import React, { PropTypes } from 'react';

import Header from './components/Header';
import Nav from './components/Nav';

const App = ({ children }) => (
  <div id="wrapper">
    <Header/>
    <div id="main">
      {children}
    </div>
    <Nav/>
  </div>
);

App.propTypes = {
  children: PropTypes.object
};

export default App;
