import React, {Component} from 'react';

class Nav extends Component {
  render() {
    return (
      <div className="side-nav">
        <div className="header">
            {/* Doesn't seem to work in react */}
            <div className="unselectable">
                <h1>MICHAEL D'ANGELO</h1>
            </div>
            <h2><a href="mailto:michael.l.dangelo@gmail.com">michael.l.dangelo@gmail.com</a></h2>
            <br/>
            <img src="/images/me.jpg" alt="" className="img-responsive"/>
            <br/>
        </div>
        <div className="footer">
            <header>
                <h3>About Me</h3>
            </header>
            <p>Hi, I'm Michael. I like building things. I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate and the CTO of <a href="http://arthena.com">Arthena</a>. Before Arthena I was at <a href="http://planet.com">Planet Labs</a>, <a href="http://planetaryresources.com">Planetary Resources</a>, <a href="http://facebook.com">Facebook</a>, and <a href="http://seds.org">SEDS</a>.</p>
        </div>
      </div>
    );
  }
}

export default Nav;
