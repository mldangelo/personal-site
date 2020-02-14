import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

// Featured
import Index from './views/Index';
import About from './views/About';
import Contact from './views/Contact';
import Services from './views/Services';
import ServicesEs from './views/ServicesEs';

import NotFound from './views/NotFound';

// All of our CSS
import './static/css/main.scss';

ReactDOM.render(
  <Router basename={BASE_PATH}>

    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/services" component={Services} />
      <Route path="/servicesEs" component={ServicesEs} />
      {/* Only useful in development mode */}
      <Route component={NotFound} status={404} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
