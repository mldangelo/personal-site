import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Route, Redirect } from 'react-router-dom';

const { id, admin } = Cookies.get();

const AdminRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!id) { // checks for non authenticated accounts
        Cookies.set('target', props.location.pathname);
      }
      return (
        admin ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: id ? '/unauthorized' : '/login',
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
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.string,
  }),
};

AdminRoute.defaultProps = {
  component: null,
  location: {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: '',
  },
};

export default AdminRoute;
