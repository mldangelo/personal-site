import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';

class Header extends Component {
  render() {
    return (
      <header id="header">
        <h1><IndexLink to="/">Michael D'Angelo</IndexLink></h1>
        <nav className="links">
          <ul>
            <li><Link to="/resume">Resume</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            {/* <li><a href="#">Posts</a></li> */}
            <li><Link to="/stats">Stats</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
