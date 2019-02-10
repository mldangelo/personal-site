import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
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
  <Router>
    <Switch>
      <Route
        exact
        path={`${BASE_PATH}/`}
        render={() => (path !== '/' ? (<Redirect to={`${BASE_PATH}/${path}`} />) : (<Index />))}
      />
      <Route path={`${BASE_PATH}/about`} component={About} />
      <Route path={`${BASE_PATH}/projects`} component={Projects} />
      <Route path={`${BASE_PATH}/stats`} component={Stats} />
      <Route path={`${BASE_PATH}/contact`} component={Contact} />
      <Route path={`${BASE_PATH}/resume`} component={Resume} />
      {/* Only useful in development mode */}
      <Route component={NotFound} status={404} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
