import React, {Component} from 'react';
import { Link } from 'react-router';

import Education from './Resume/Education';
import Experience from './Resume/Experience';
import Skills from './Resume/Skills';
import Courses from './Resume/Courses';

class Resume extends Component {
  render() {
    return (
      <article className="post" id="resume">
        <header>
          <div className="title">
            <h2><Link to="/resume">Resume</Link></h2>
          </div>
        </header>

        <Education/>
        <Experience/>
        <Skills/>
        <Courses/>

        <article>
          <div className="references">
            <div className="title">
              <Link to="/contact">
                <h3>References are available upon request</h3>
              </Link>
            </div>
          </div>
        </article>


        <footer>
          <ul className="stats">
            <li><a href="#" className="icon fa-heart">0</a></li>
          </ul>
        </footer>

      </article>
    );
  }
}

export default Resume;
