import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

import App from './App';
import FullPage from './FullPage';

import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Stats from './pages/Stats';
import Contact from './pages/Contact';

import Music from './pages/Music';

import NotFound from './pages/NotFound';

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

// All of our CSS
require('../public/css/main.scss');

ReactDOM.render(
  <Router onUpdate={update} history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="/about" component={About} />
      <Route path="/resume" component={Resume} />
      <Route path="/projects" component={Projects} />
      <Route path="/stats" component={Stats} />
      <Route path="/contact" component={Contact} />
    </Route>
    <Route path="/" component={FullPage}>
      <Route path="/music" component={Music} />
    </Route>
    <Route path="*" component={NotFound} status={404} />
  </Router>,
  document.getElementById('root'),
);
