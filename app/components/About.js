import React, {Component} from 'react';
import { IndexLink } from 'react-router';

class About extends Component {
  render() {
    return (
      <article className="post" id="about">
        <header>
          <div className="title">
            <h2><IndexLink to="/">About this site</IndexLink></h2>
            <p>A beautiful, responsive, <s>isomorphic,</s> react app written with ES2016. Please hire me.</p>
          </div>
        </header>
        <p> Go ahead, resize the page. See how beatifully it responds. I dare you.</p>
        <p> Source available <a href="https://github.com/mldangelo/mldangelo">here.</a> </p>
        <footer>
          <ul className="stats">
            <li><a href="#" className="icon fa-heart">0</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}

export default About;
