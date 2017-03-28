import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest} render={props => (
    window.id ? (
      React.createElement(component, props)
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    )
  )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.string, // TODO Verify this type
};

PrivateRoute.defaultProps = {
  component: null,
  location: '',
};

export default PrivateRoute;
