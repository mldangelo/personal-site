import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'js-cookie';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest} render={(props) => {
      if (!window.id) { // checks for non authenticated accounts
        cookie.set('target', props.location.pathname);
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
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.string,
  }),
};

PrivateRoute.defaultProps = {
  component: null,
  location: {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: '',
  },
};

export default PrivateRoute;
