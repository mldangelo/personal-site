import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import ReactGA from 'react-ga';

// Layouts
import Main from './layouts/Main';

import Index from './views/Index';
import About from './views/About';
import Projects from './views/Projects';
import Resume from './views/Resume';
import Stats from './views/Stats';
import Contact from './views/Contact';

import Music from './views/Music';

import NotFound from './views/NotFound';


// All of our CSS
require('../public/css/main.scss');

ReactDOM.render(
    <Router>
    <div id="wrapper">
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/about" component={About} />
        <Route path="/resume" component={Resume} />
        <Route path="/projects" component={Projects} />
        <Route path="/stats" component={Stats} />
        <Route path="/contact" component={Contact} />
        <Route path="/music" component={Music} />
        <Route component={NotFound} status={404} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root'),
);
