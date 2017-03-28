import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component, ...rest }) => (
  <Route
    {...rest} render={props => (
    window.admin ? (
      React.createElement(component, props)
    ) : (
      <Redirect
        to={{
          pathname: '/unauthorized',
          state: { from: props.location },
        }}
      />
    )
  )}
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
