import React, {Component} from 'react';

class AboutSite extends Component {
  render() {
    return (
      <article className="post">
        <header>
          <div className="title">
            <h2><a href="#">Links I enjoy, sorted by my visit frequency</a></h2>
          </div>
        </header>
        <p>smbc, xkcd?, reddit/spacex, nytimes hackernews</p>
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
