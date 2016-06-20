import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import Menus from 'react-burger-menu';
const Menu = Menus.slide;

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open:  false,
    };
  }

  handleClick() {
    console.log('open:',this.state.open);
    this.setState({
      open: !this.state.open,
    });
  }

  getButton() {
    return this.state.open ? (
      <li className="menu close-menu" onClick={this.handleClick.bind(this)}>
        <a className="fa-times close-menu">Menu</a>
      </li>
    ) : (
      <li className="menu open-menu" onClick={this.handleClick.bind(this)}>
        <a className="fa-bars">Menu</a>
      </li>
    );
  }

  render() {
    return (
      <header id="header">
        <h1 className="index-link"><IndexLink to="/">Michael D'Angelo</IndexLink></h1>
        <nav className="links">
          <ul>
            <li><Link to="/resume">Resume</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            {/* <li><a href="#">Posts</a></li> */}
            <li><Link to="/stats">Stats</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="hamburger-container">
          <nav className="main" id="hambuger-nav">

            <ul>
              {this.getButton()}
            </ul>

          </nav>
          <Menu
            right
            noOverlay
            customBurgerIcon={ false }
            customCrossIcon={ false }
            isOpen={this.state.open}
          >
            <IndexLink to="/">MICHAEL D'ANGELO</IndexLink>
            <a></a><Link className="hamburger-link" to="/resume">RESUME</Link>
            <a></a><Link to="/projects">PROJECTS</Link>
            <a></a><Link to="/stats">STATS</Link>
            <a></a><Link to="/contact">CONTACT</Link>
          </Menu>
        </div>
      </header>
    );
  }
}

export default Header;
