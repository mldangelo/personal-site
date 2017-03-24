import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

// Layouts
import Main from './layouts/Main';

import Index from './views/Index';
import About from './views/About';
import Projects from './views/Projects';
import Resume from './views/Resume';
import Stats from './views/Stats';
import Contact from './views/Contact';

import auth from './components/auth';

import Login from './views/Login';
import Logout from './views/Logout';

import Music from './views/Music';

import NotFound from './views/NotFound';

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
  <Router onUpdate={update} history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Index} />
      <Route path="/about" component={About} />
      <Route path="/resume" component={Resume} onEnter={requireAuth} />
      <Route path="/projects" component={Projects} />
      <Route path="/stats" component={Stats} />
      <Route path="/contact" component={Contact} />
    </Route>

    <Route path="/" component={props => (<Main fullPage>{props.children}</Main>)}>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/music" component={Music} />
    </Route>
    <Route path="*" component={NotFound} status={404} />
  </Router>,
  document.getElementById('root'),
);
