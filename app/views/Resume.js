import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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



class Resume extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentWillMount() {
    axios.get('/api/resume').then((result) => {
      this.setState({
        data: result.data,
      });
    }).catch((error) => {
      console.error('resume-api-fetch-error', error);
    });
  }

  render() {
    return (
      <Main>
        <article className="post" id="resume">
          <Helmet title="Resume" />
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
          <Education data={this.state.data.degrees}/>
          <Experience data={this.state.data.positions}/>
          <Skills skills={this.state.data.skills} categories={this.state.data.categories}/>
          <Courses data={this.state.data.courses}/>
          <References />

        </article>
      </Main>
    );
  }
}

export default Resume;
