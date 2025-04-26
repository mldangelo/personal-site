import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Labels from '../Labels';

import ContactIcons from '../Contact/ContactIcons';
import { labels, categories } from '../../data/labels';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = ({ showFooter }) => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Kai Zhang</h2>
        <p>
          <a href="mailto:zhangkai@ethz.ch">zhangkai@ethz.ch</a>
        </p>
        {!showFooter && <ContactIcons />}
      </header>
    </section>

    <section className="blurb">
      <h2>Key Words</h2>
      <div className="link-container" style={{ marginBottom: '1.5em' }}>
        <Labels labels={labels} categories={categories} />
      </div>
      {/* <ul className="actions">
        <li>
          <Link to="/resume" className="button">
            Curriculum Vitae
          </Link>
        </li>
      </ul> */}
    </section>

    {showFooter && (
      <section id="footer">
        <ContactIcons />
        <p className="copyright">
          &copy; 2025 Kai Zhang (No. 1a685a255)
        </p>
      </section>
    )}
  </section>
);

SideBar.propTypes = {
  showFooter: PropTypes.bool,
};

SideBar.defaultProps = {
  showFooter: true,
};

export default SideBar;
