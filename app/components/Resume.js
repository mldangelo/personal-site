import React from 'react';
import { Link } from 'react-router';

import Education from './Resume/Education';
import Experience from './Resume/Experience';
import Skills from './Resume/Skills';
import Courses from './Resume/Courses';
import References from './Resume/References';

const Resume = () => (
  <article className="post" id="resume">
    <header>
      <div className="title">
        <h2><Link to="/resume">Resume</Link></h2>
        <div className="link-container">
          <h4><a href="#education">Education</a></h4>
          <h4><a href="#experience">Experience</a></h4>
          <h4><a href="#skills">Skills</a></h4>
          <h4><a href="#courses">Courses</a></h4>
          <h4><a href="#references">References</a></h4>
        </div>

      </div>
    </header>

    <Education />
    <Experience />
    <Skills />
    <Courses />
    <References />

  </article>
);

export default Resume;
