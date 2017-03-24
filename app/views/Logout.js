import React, { Component } from 'react';
import { withRouter } from 'react-router';
import auth from '../components/auth';

class Logout extends Component {

  componentWillMount() {
    auth.logout(() => { this.props.router.replace('/'); });
  }

  render() {
    return (
      <p>You are now logged out</p>
    );
  }

}

export default withRouter(Logout);
