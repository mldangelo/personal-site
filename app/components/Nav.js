import React, {Component} from 'react';

class Nav extends Component {
  render() {
    return (
      <div>
        <header id="header">
            <div class="unselectable">
                <h1>MICHAEL D'ANGELO</h1>
            </div>
            <h2><a href="mailto:michael.l.dangelo@gmail.com">michael.l.dangelo@gmail.com</a></h2></header>
        <footer id="footer">
            <header>
                <h3>About Me</h3>
            </header>
            <p>Hi, I'm Michael. I like building things. I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate and the CTO of <a href="http://arthena.com">Arthena</a>. Before Arthena I was at <a href="http://planet.com">Planet Labs</a>, <a href="http://planetaryresources.com">Planetary Resources</a>, <a href="http://facebook.com">Facebook</a>, and <a href="http://seds.org">SEDS</a>.</p>
        </footer>
      </div>
    );
  }
}

export default Nav;
