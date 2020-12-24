import React from 'react';
import { hydrate, render } from 'react-dom';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

// Featured
import About from './pages/About';
import Contact from './pages/Contact';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Stats from './pages/Stats';

// All of our CSS
import './static/css/main.scss';

const { PUBLIC_URL } = process.env;

const rootElement = document.getElementById('root');

const App = () => (
  <Router basename={PUBLIC_URL}>
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
  </Router>
);

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
