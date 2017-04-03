import React, { PropTypes } from 'react';
import cookie from 'react-cookie';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest} render={(props) => {
      if (!window.id) { // checks for non authenticated accounts
        cookie.save('target', props.location.pathname, { path: '/' });
      }
      return (
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
      );
    }}
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
