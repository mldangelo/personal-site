import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Main from '../layouts/Main';

import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import Certifications from '../components/Resume/Certifications';
import Skills from '../components/Resume/Skills';
import Courses from '../components/Resume/Courses';
import References from '../components/Resume/References';

import courses from '../data/resume/courses';
import degrees from '../data/resume/degrees';
import positions from '../data/resume/positions';
import certifications from '../data/resume/certifications';
import { skills, categories } from '../data/resume/skills';

const sections = [
  'Education',
  'Experience',
  'Skills',
  'Courses',
  'References',
];

const certificationsPresent = typeof certifications !== 'undefined'
  && certifications != null
  && certifications.length != null
  && certifications.length > 0;

if (certificationsPresent) {
  sections.splice(2, 0, 'Certifications');
}

const Resume = () => (
  <Main>
    <Helmet title="Resume" />
    <article className="post" id="resume">
      <header>
        <div className="title">
          <h2><Link to="resume">Resume</Link></h2>
          <div className="link-container">
            {sections.map((sec) => (
              <h4 key={sec}>
                <a href={`#${sec.toLowerCase()}`}>{sec}</a>
              </h4>))}
          </div>

        </div>
      </header>
      <Education data={degrees} />
      <Experience data={positions} />
      {certificationsPresent && <Certifications data={certifications} />}
      <Skills skills={skills} categories={categories} />
      <Courses data={courses} />
      <References />

    </article>
  </Main>
);

export default Resume;
