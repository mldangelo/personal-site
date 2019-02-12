import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Helmet from 'react-helmet';
import axios from 'axios';

import Main from '../layouts/Main';

import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import Skills from '../components/Resume/Skills';
import Courses from '../components/Resume/Courses';
import References from '../components/Resume/References';

const sections = [
  'Education',
  'Experience',
  'Skills',
  'Courses',
  'References',
];

const Resume = ({ history }) => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    const { data: resumeData } = await axios('/api/resume');
    if (!resumeData.success) {
      history.push('/login');
    }
    setData(resumeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Main>
      <Helmet title="Resume" />
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
        <Education data={data.degrees} />
        <Experience data={data.positions} />
        <Skills skills={data.skills} categories={data.categories} />
        <Courses data={data.courses} />
        <References />

      </article>
    </Main>
  );
};

Resume.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(Resume);
