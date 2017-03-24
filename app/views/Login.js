import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth from '../components/auth';
import Main from '../layouts/Main';

const success = (response) => {
  console.log(response);
};

const error = (response) => {
  console.error(response);
};

const loading = () => {
  console.log('loading');
};


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
      <Main fullPage>
      <article className="post" id="login">
        <div>
        <h2><Link to="/login">Login</Link></h2>
          <p> You&apos;re about to learn a lot about me. Let me learn a little about you. I only ask for your email address and I promise not to spam you. You can login with your google account below.</p>
          <div className="horiztonal-container">
          <div className="auth-label">
          <a href="/login/google"><h3> Login with Google</h3></a>
          </div>
          <ul className="icons auth-button">
            <li><a href="/login/google" className="fa-google"><span className="label">Google</span></a></li>
          </ul>
          </div>
        </div>
      </article>
      </Main>
    );
  }

}

export default withRouter(Login);
