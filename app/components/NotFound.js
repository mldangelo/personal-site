import React, { Component } from 'react';
import { Link } from 'react-router'

class PageNotFound extends Component {

  render() {
    return (
      <div className="not-found">
        <h1>Page Not Found.</h1>
        <p>Return to <Link to="/">index</Link>.</p>
      </div>
    );
  }
}

export default PageNotFound;
