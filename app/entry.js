import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

// Featured
import Index from './views/Index';
import About from './views/About';
import Projects from './views/Projects';
import Resume from './views/Resume';
import Stats from './views/Stats';
import Contact from './views/Contact';

// Hidden
import Music from './views/Music';

import Login from './views/Login';

import NotFound from './views/NotFound';

import axios from 'axios';


// All of our CSS
require('../public/css/main.scss');

class Auth {
  constructor(){
    this.isAuthenticated = false;
    axios.get('/api/authenticated').then((result) => {
        this.isAuthenticated = result.data.authenticated;
    }).catch((error) => {
      console.error('auth-api-fetch-error', error);
    });
  }
}

const auth = new Auth();

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/about" component={About} />
      <PrivateRoute path="/resume" component={Resume} />
      <Route path="/projects" component={Projects} />
      <Route path="/stats" component={Stats} />
      <Route path="/contact" component={Contact} />
      <Route path="/music" component={Music} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} status={404} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
