import React, {Component} from 'react';

class AboutSite extends Component {
  render() {
    return (
      <article className="post" id="projects">
        <header>
          <div className="title">
            <h2><a href="#projects">Projects</a></h2>
            <p>A selection of projects that I'm not too ashamed of</p>
          </div>
        </header>
        <p>Cat Detector</p>
        <p>Harvest</p>
        <p>Nearest Dollar</p>
        <p>Space Potato</p>
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
