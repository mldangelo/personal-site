import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Featured
import Index from './views/Index';
import About from './views/About';
import Projects from './views/Projects';
import Resume from './views/Resume';
import Stats from './views/Stats';
import Contact from './views/Contact';

// Hidden
import Music from './views/Music';

import NotFound from './views/NotFound';

// All of our CSS
require('./static/css/main.scss');

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/stats" component={Stats} />
      <Route path="/contact" component={Contact} />
      <Route path="/music" component={Music} />
      <Route path="/resume" component={Resume} />

      <Route component={NotFound} status={404} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
