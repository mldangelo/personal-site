import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';



import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';

import Index from '../views/Index';
import About from '../views/About';
import Projects from '../views/Projects';
import Resume from '../views/Resume';
import Stats from '../views/Stats';
import Contact from '../views/Contact';


const Main = (props) => (
  <Router>
  <div id="wrapper">
    <Helmet titleTemplate="%s | Michael D'Angelo" defaultTitle="Michael D'Angelo" />
    <Header />
    <div id="main">
      <Switch>
        <Route path="/" exact component={Index}/>
        <Route path="/about" component={About} />
        <Route path="/resume" component={Resume} />
        <Route path="/projects" component={Projects} />
        <Route path="/stats" component={Stats} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </div>
     <Nav />
  </div>
  </Router>
);

export default Main;
