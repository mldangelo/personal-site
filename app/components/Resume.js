import React from 'react';
import { Link } from 'react-router';

import Education from './Resume/Education';
import Experience from './Resume/Experience';
import Skills from './Resume/Skills';
import Courses from './Resume/Courses';
import References from './Resume/References';

const sections = [
  'Education',
  'Experience',
  'Skills',
  'Courses',
  'References',
];


const Resume = () => (
  <article className="post" id="resume">
    <header>
      <div className="title">
        <h2><Link to="/resume">Resume</Link></h2>
        <div className="link-container">
          {sections.map(sec => (
            <h4 key={sec}>
              <a href={`#${sec.toLowerCase()}`}>{sec}</a>
            </h4>))}
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
