import React, { Component } from 'react';
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

        <Education />
        <Experience />
        <Skills />
        <Courses />

        <div className="references">
          <div className="title">
            <Link to="/contact">
              <h3>References are available upon request</h3>
            </Link>
          </div>
        </div>

      </article>
    );
  }
}

export default Resume;
