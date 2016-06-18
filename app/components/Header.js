import React, {Component} from 'react';

class Header extends Component {
  render() {
    return (
      <header id="header">
        <h1><a href="#">Michael D'Angelo</a></h1>
        <nav className="links">
          <ul>
            <li><a href="#">Resume</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Posts</a></li>
            <li><a href="#">Stats</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <nav className="main">
          <ul>
            <li className="menu">
              <a className="fa-bars" href="#menu">Menu</a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
