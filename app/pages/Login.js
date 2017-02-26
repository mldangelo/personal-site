import React, { Component } from 'react';
import { withRouter } from 'react-router';
import auth from '../components/auth';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const email = this.email.value;
    const pass = this.pass.value;

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn) { return this.setState({ error: true }); }

      const { location } = this.props;

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname);
      } else {
        this.props.router.replace('/');
      }
    });
  }

  render() {
    return (
      <article className="post" id="login">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email"><input ref={(input) => { this.email = input; }} placeholder="email" /></label>
          <label htmlFor="password"><input ref={(input) => { this.pass = input; }} placeholder="password" /></label> (hint: password)<br />
          <button type="submit">login</button>
          {this.state.error && (
            <p>Bad login information</p>
          )}
        </form>
      </article>
    );
  }

}

export default withRouter(Login);
