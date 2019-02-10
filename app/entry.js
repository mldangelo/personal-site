import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Redirect, Switch, Route,
} from 'react-router-dom';

// Featured
import Index from './views/Index';
import About from './views/About';
import Projects from './views/Projects';
import Resume from './views/Resume';
import Stats from './views/Stats';
import Contact from './views/Contact';

import NotFound from './views/NotFound';

// All of our CSS
import './static/css/main.scss';

// url search parameters, in our case ?path=[:slug]
const params = window.location.search;


/* this is a hack for github hosting redirects. It is difficult to host multipage
applications on github, so I built a custom 404 page to redirect all traffic
to /?path=wherever which will load this react application. This code extracts the requested
path and then attempts to route the user to their intended destination.
*/

let path = '/'; // path we will redirect to if param exit
if (params.search('path=') > -1) { // check if exists
  path = params.substr(1 + 'path='.length).trim();
}

ReactDOM.render(
  <Router basename={BASE_PATH}>
    <Switch>
      <Route
        exact
        path="/"
        render={() => (path !== '/' ? (<Redirect to={`${path}`} />) : (<Index />))}
      />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/stats" component={Stats} />
      <Route path="/contact" component={Contact} />
      <Route path="/resume" component={Resume} />
      {/* Only useful in development mode */}
      <Route component={NotFound} status={404} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
