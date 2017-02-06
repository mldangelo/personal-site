import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import Menus from 'react-burger-menu';

import links from '../../../data/links';

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
          <ul className="hamburger-ul">
            {links.filter(l => l.index).map(l => (
              <li>
                <IndexLink to={l.link} onClick={this.handleClick}><h3>{l.label}</h3></IndexLink>
              </li>
            ))}
            {links.filter(l => !l.index).map(l => (
              <li>
                <Link to={l.link} onClick={this.handleClick}><h3>{l.label}</h3></Link>
              </li>
            ))}
          </ul>
        </Menu>
      </div>
    );
  }
}

export default Hamburger;
