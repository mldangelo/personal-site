import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Main from '../layouts/Main';

class Login extends Component {

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

export default Login;
