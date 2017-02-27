import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
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
        <header>
          <div className="title">
            <h2><Link to="/">Login</Link></h2>
            <p>Please login to view this page.</p>
          </div>
        </header>
        <div>

          <p> You&apos;re about to learn a lot about me. Let me learn a little about you. I only ask for your email address and I promise not to spam you.</p>

          <h3> Login with Google</h3>
          <ul className="icons">
            <li><a href="/login/google" className="fa-google"><span className="label">Google</span></a></li>
          </ul>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="email"><input ref={(input) => { this.email = input; }} placeholder="email" /></label>
            <label htmlFor="password"><input ref={(input) => { this.pass = input; }} placeholder="password" /></label> (hint: password)<br />
            <button type="submit">login</button>
            {this.state.error && (
              <p>Bad login information</p>
            )}
          </form>
        </div>
      </article>
    );
  }

}

export default withRouter(Login);
