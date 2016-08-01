import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';

class About extends Component {
  render() {
    return (
      <article className="post" id="about">
        <header>
          <div className="title">
            <h2><IndexLink to="/">About this site</IndexLink></h2>
            <p>A beautiful, responsive, react app written with ES2016. Please hire me.</p>
          </div>
        </header>
        <p> Welcome to my website. Please feel free to check out my {' '}
          <Link to="/resume">resume</Link>, {' '}
          <Link to="/projects">projects</Link>, {' '}
          view <Link to="/stats">site statistics</Link>, {' '}
          or <Link to="/contact">contact</Link> me.</p>
        <p> Source available <a href="https://github.com/mldangelo/mldangelo">here</a>.</p>
      </article>
    );
  }
}

export default About;
