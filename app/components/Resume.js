import React, {Component} from 'react';

const jobs = [
  {
    company: 'Zenysis',
    position: 'Consultant',
    link: 'http://zenysis.com',
    time: 'February 2016 - March 2016',
    points: [
      'Worked in Addis Ababa for the Ethiopian Ministry of Health and built data visualization tools in React, Flask.',
    ],
  },{
    company: 'Matroid',
    position: 'Cofounder',
    link: 'http://matroid.com',
    time: 'July 2015 - January 2016',
    points: [
      'Developed end to end machine learning pipeline to train visual classifiers from keywords using Node.JS, Express, Keystone, MongoDB, AWS, S3, Caffe, and other technologies.',
      'Received Series A term sheets for 20M+ valuations.',
    ],
  },{
    company: 'Arthena',
    position: 'Software Engineer',
    link: 'http://arthena.com',
    time: 'January 2014 - Present',
    points: [
      'First employee. Helped raise 1.3M in funding to develop new model for private equity investing.',
      'Lead development team, set development lifecycle, and managed web product.',
      'Worked on everything. Hired technical and nontechnical roles, found office space, staged corporate events, managed reimbursements and payroll, etc. etc.',
    ],
  },
];

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
        <div className="education">
          <div className="title">
            <h3>Education</h3>
          </div>
          <div className="school">
            <p>M.S. Computational and Mathematical Engineering</p>
            <p>Stanford University. 2016.</p>
          </div>
          <div className="school">
            <p>B.S. Electical Engineering, Computer Engineering</p>
            <p>University at Buffalo. 2012. Graduated first in class.</p>
          </div>
        </div>

        <div className="experience">
          <div className="title">
            <h3>Experience</h3>
          </div>

          <div className="job">
            <div className="company">
              <p>Zenysis</p>
            </div>
          </div>
        </div>

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
