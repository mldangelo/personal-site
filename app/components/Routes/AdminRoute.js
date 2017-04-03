import React, { PropTypes } from 'react';
import cookie from 'react-cookie';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component, ...rest }) => (
  <Route
    {...rest} render={(props) => {
      if (!window.id) { // checks for non authenticated accounts
        cookie.save('target', props.location.pathname, { path: '/' });
      }
      return (
        window.admin ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: window.id ? '/unauthorized' : '/login',
              state: { from: props.location },
            }}
          />
        )
      );
    }}
  />
);

AdminRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.string, // TODO Verify this type
};

AdminRoute.defaultProps = {
  component: null,
  location: '',
};

export default AdminRoute;
