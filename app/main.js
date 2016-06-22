import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App';

import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';

import Skills from './components/Resume/Skills';

import Stats from './components/Stats';
import Contact from './components/Contact';

import NotFound from './components/NotFound';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-68649021-1');

const update = () => {
  window.scrollTo(0, 0);
  ReactGA.pageview(window.location.pathname);
};

// All of our CSS
require('!style!css!sass!../public/css/main.scss');

ReactDOM.render(
  <Router onUpdate={update} history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={About}/>
      <Route path="/resume" component={Resume}/>
      <Route path="/projects" component={Projects}/>
      <Route path="/stats" component={Stats}/>
      <Route path="/contact" component={Contact}/>
    </Route>
    <Route path="*" component={NotFound} status={404}/>
  </Router>,
  document.getElementById('root')
);
