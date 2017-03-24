import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import ReactGA from 'react-ga';

// Layouts
import Main from './layouts/Main';


if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-68649021-1');
}

const update = () => {
  window.scrollTo(0, 0);
  if (process.env.NODE_ENV === 'production') {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

// All of our CSS
require('../public/css/main.scss');

ReactDOM.render(
  <Main />,
  document.getElementById('root'),
);
