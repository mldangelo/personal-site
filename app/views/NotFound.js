import React from 'react';
import Helmet from 'react-helmet';
import Link from '../components/Link';

const PageNotFound = () => (
  <div className="not-found">
    <Helmet title="404" />
    <h1>Page Not Found.</h1>
    <p>Return to <Link to="/">index</Link>.</p>
  </div>
);

export default PageNotFound;
