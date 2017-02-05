import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import Menus from 'react-burger-menu';

const Menu = Menus.slide;

class Hamburger extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  getButton() {
    return this.state.open ? (
      <li className="menu close-menu" onClick={this.handleClick}>
        <a className="fa-times close-menu">Menu</a>
      </li>
    ) : (
      <li className="menu open-menu" onClick={this.handleClick}>
        <a className="fa-bars">Menu</a>
      </li>
    );
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <div className="hamburger-container">
        <nav className="main" id="hambuger-nav">
          <ul>
            {this.getButton()}
          </ul>
        </nav>
        <Menu right noOverlay isOpen={this.state.open}>
          <IndexLink to="/" onClick={this.handleClick}>MICHAEL DANGELO</IndexLink>
          <a /><Link to="/resume" onClick={this.handleClick}>RESUME</Link>
          <a /><Link to="/projects" onClick={this.handleClick}>PROJECTS</Link>
          {/* <a></a><Link to="/posts">POSTS</Link> */}
          <a /><Link to="/stats" onClick={this.handleClick}>STATS</Link>
          <a /><Link to="/contact" onClick={this.handleClick}>CONTACT</Link>
        </Menu>
      </div>
    );
  }
}

export default Hamburger;
