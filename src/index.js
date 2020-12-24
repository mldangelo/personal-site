import React, { Suspense, lazy } from 'react';
import { hydrate, render } from 'react-dom';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

// All of our CSS
import './static/css/main.scss';

import Main from './layouts/Main'; // used as our fallback when lazy loading routes

// Every route - we lazy load so that each page can be chunked
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Projects = lazy(() => import('./pages/Projects'));
const Resume = lazy(() => import('./pages/Resume'));
const Stats = lazy(() => import('./pages/Stats'));

const { PUBLIC_URL } = process.env;

const rootElement = document.getElementById('root');

const App = () => (
  <Router basename={PUBLIC_URL}>
    <Suspense fallback={<Main />}>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/stats" component={Stats} />
        <Route path="/contact" component={Contact} />
        <Route path="/resume" component={Resume} />
        {/* Only useful in development mode */}
        <Route component={NotFound} status={404} />
      </Switch>
    </Suspense>
  </Router>
);

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
