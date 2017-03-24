import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import auth from '../components/auth';

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
      <article className="post" id="login" style={{width: '50%'}}>
        <header>
          <div className="title">
            <h2><Link to="/">Login</Link></h2>
            <p>Please login to view this page.</p>
          </div>
        </header>
        <div>

          <p> You&apos;re about to learn a lot about me. Let me learn a little about you. I only ask for your email address and I promise not to spam you. You can login with your google account below.</p>

          <h3> Login with Google</h3>
          <ul className="icons">
            <li><a href="/login/google" className="fa-google"><span className="label">Google</span></a></li>
          </ul>
        </div>
      </article>
    );
  }

}

export default withRouter(Login);
