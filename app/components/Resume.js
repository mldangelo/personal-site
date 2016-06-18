import React, {Component} from 'react';

class AboutSite extends Component {
  render() {
    return (
      <article className="post">
        <header>
          <div className="title">
            <h2><a href="#">Resume</a></h2>
          </div>
        </header>
        <p>M.S. Computational and Mathematical Engineering, Stanford University. 2016.</p>
        <p>B.S. Electical Engineering, Computer Engineering, University at Buffalo. 2012.</p>
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

export default AboutSite;
