import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

const PageNotFound = () => (
  <div className="not-found">
    <Helmet title="404" />
    <h1>Page Not Found.</h1>
    <p>Return to <Link to="/">index</Link>.</p>
  </div>
);

export default PageNotFound;
