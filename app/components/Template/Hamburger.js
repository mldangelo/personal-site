import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Menus from 'react-burger-menu';

import routes from '../../data/routes';

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
      <li className="menu close-menu">
        <a onClick={this.handleClick} className="fa-times close-menu">Menu</a>
      </li>
    ) : (
      <li className="menu open-menu">
        <a onClick={this.handleClick} className="fa-bars">Menu</a>
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
            {routes.map(l => (
              <li key={l.label} onClick={this.handleClick}>
                <Link to={l.path}>
                  <h3 className={l.index ? 'index-li' : null}>{l.label}</h3>
                </Link>
              </li>
            ))}
            {window.admin ? <li><a href="/admin"><h3>Admin</h3></a></li> : null}
            {window.id ? <li><a href="/logout"><h3>Logout</h3></a></li> : null}
          </ul>
        </Menu>
      </div>
    );
  }
}

export default Hamburger;
