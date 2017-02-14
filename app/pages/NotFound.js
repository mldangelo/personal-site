import React from 'react';
import { Link } from 'react-router';

const PageNotFound = () => (
  <div className="not-found">
    <h1>Page Not Found.</h1>
    <p>Return to <Link to="/">index</Link>.</p>
  </div>
);

export default PageNotFound;
