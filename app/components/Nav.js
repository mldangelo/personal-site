import React, {Component} from 'react';

class Nav extends Component {
  render() {
    return (
      <section id="sidebar">
          <section id="intro">
            <a href="" className="logo"><img src="/images/me.jpg" alt="" /></a>
            <header>
              <h2>Michael D'Angelo</h2>
              <p><a href="mailto:michael.l.dangelo@gmail.com">michael.l.dangelo@gmail.com</a></p>
            </header>
          </section>

          <section className="blurb">
            <h2>About</h2>
              <p>Hi, I'm Michael. I like building things.
                I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate and
                the CTO of <a href="http://arthena.com">Arthena</a>. Before Arthena I was
                at <a href="http://planet.com">Planet<s> Labs</s></a>, <a href="http://planetaryresources.com">Planetary Resources</a>, <a href="http://facebook.com">Facebook</a>, and <a href="http://seds.org">SEDS</a>.</p>
            <ul className="actions">
              <li><a href="#resume" className="button">Learn More</a></li>
            </ul>
          </section>

          <section id="footer">
            <ul className="icons">
              <li><a href="https://github.com/mldangelo" className="fa-github"><span className="label">RSS</span></a></li>
              <li><a href="https://facebook.com/d" className="fa-facebook"><span className="label">Facebook</span></a></li>
              <li><a href="https://www.instagram.com/dangelosaurus/" className="fa-instagram"><span className="label">Instagram</span></a></li>
              <li><a href="https://www.linkedin.com/in/michaelldangelo" className="fa-linkedin"><span className="label">Instagram</span></a></li>
              <li><a href="https://angel.co/michael-d-angelo" className="fa-angellist"><span className="label">Twitter</span></a></li>
              <li><a href="https://twitter.com/dangelosaurus" className="fa-twitter"><span className="label">Twitter</span></a></li>
              <li><a href="mailto:michael.l.dangelo@gmail.com" className="fa-envelope"><span className="label">Email</span></a></li>
            </ul>
            <p className="copyright">&copy; Michael D'Angelo <a href="http://mldangelo.com">mldangelo.com</a>.</p>
          </section>
      </section>
    );
  }
}

export default Nav;
