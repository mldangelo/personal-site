import React, {Component} from 'react';

import Education from './Resume/Education';
import Jobs from './Resume/Jobs';


const courses = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'http://stanford.edu/class/ee364a/',
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
  },
  {
    title: 'Convolutional Neural Networks for Visual Recognition',
    number: 'CS 231n',
    link: 'http://cs231n.stanford.edu/',
  },
  {
    title: 'Numerical Linear Algebra',
    number: 'CME 302',
    link: 'http://scpd.stanford.edu/search/publicCourseSearchDetails.do;jsessionid=561188A06434D7D97953C4706DE12831?method=load&courseId=11685',
  },
  {
    title: 'Numerical Optimization',
    number: 'CME 304',
    link: 'http://web.stanford.edu/class/cme304/',
  },
];

const skills = [
  {
    title: 'Javascript',
    compentency: 4,
  },
  {
    title: 'HTML',
    compentency: 4,
  },
  {
    title: 'CSS',
    compentency: 5,
  },
  {
    title: 'Python',
    compentency: 5,
  },
  {
    title: 'C++',
    compentency: 3,
  },
];

class Resume extends Component {
  render() {
    return (
      <article className="post" id="resume">
        <header>
          <div className="title">
            <h2><a href="#resume">Resume</a></h2>
          </div>
        </header>

      <Education/>
      <Jobs/>

        <div className="skills">
          <div className="title">
            <h3>Skills</h3>
          </div>

          <div className="skill">
              <p>Javascript</p>
          </div>
        </div>

        <div className="courses">
          <div className="title">
            <h3>Courses</h3>
          </div>

          <div className="course">
              <p>Convex Optimization</p>
          </div>
        </div>

        <footer>
          <ul className="stats">
            <li><a href="#" className="icon fa-heart">28</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}

export default Resume;
