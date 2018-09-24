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

  /* TODO(Michael): this style hierarchy is required by burger menu.
   * Find an alternative that does not require violations later.
   */
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
  getButton() {
    return this.state.open ? (
      <li className="menu close-menu">
        <div onClick={this.handleClick} className="menu-hover">&#10005;</div>
      </li>
    ) : (
      <li className="menu open-menu">
        <div onClick={this.handleClick} className="menu-hover">&#9776;</div>
      </li>
    );
  }
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */

  handleClick = () => {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  render() {
    return (
      <div className="hamburger-container">
        <nav className="main" id="hambuger-nav">
          <ul>
            {this.getButton()}
          </ul>
        </nav>
        <Menu right isOpen={this.state.open}>
          <ul className="hamburger-ul">
            {routes.map(l => (
              <li key={l.label}>
                <Link to={l.path} onClick={this.handleClick}>
                  <h3 className={l.index ? 'index-li' : null}>{l.label}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </Menu>
      </div>
    );
  }
}

export default Hamburger;
