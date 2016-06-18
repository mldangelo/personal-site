import React, {Component} from 'react';

class About extends Component {
  render() {
    return (
      <article className="post" id="about">
        <header>
          <div className="title">
            <h2><a href="#about">About this site</a></h2>
            <p>A beautiful, response, isomorphic, react app written with ES2016. Please hire me.</p>
          </div>
        </header>
        <p> Go ahead, resize the page. See how beatifully it responds. </p>
        <p> Source available here. </p>
        <footer>
          <ul className="stats">
            <li><a href="#" className="icon fa-heart">28</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}

export default About;
