import React, {Component, PropTypes} from 'react';

const positions = [
  {
    company: 'Zenysis',
    position: 'Consultant',
    link: 'http://zenysis.com',
    daterange: 'February 2016 - March 2016',
    points: [
      'Worked in Addis Ababa for the Ethiopian Ministry of Health and built data visualization tools in React, Flask.',
    ],
  }, {
    company: 'Matroid',
    position: 'Cofounder',
    link: 'http://matroid.com',
    daterange: 'July 2015 - January 2016',
    points: [
      'Developed end to end machine learning pipeline to train visual classifiers from keywords using Node.JS, Express, Keystone, MongoDB, AWS, S3, Caffe, and other technologies.',
      'Received Series A term sheets for 20M+ valuations.',
    ],
  }, {
    company: 'Arthena',
    position: 'Software Engineer',
    link: 'http://arthena.com',
    daterange: 'January 2014 - Present',
    points: [
      'First employee. Helped raise 1.3M in funding to develop new model for private equity investing.',
      'Lead development team, set development lifecycle, and managed web product.',
      'Worked on everything. Hired technical and nontechnical roles, found office space, staged corporate events, managed reimbursements and payroll, etc. etc.',
    ],
  }, {
    company: 'Planet',
    position: 'Missions Intern',
    link: 'http://planet.com',
    daterange: 'June 2014 - January 2015',
    points: [
      'Developed flight software in C/C++',
      'Performed statistical analysis of images quality in Matlab/Python.',
      'Built models to improve image quality, including but not limited to signal to noise ratio and dynamic range.',
      'Photographed events; Designed sound activated remote camera shutters for rocket launches.',
    ],
  }, {
    company: 'Planetary Resources',
    position: 'Avionics Intern',
    link: 'http://planetaryresources.com',
    daterange: 'January 2014 - May 2014',
    points: [
      'Built and assembled flight hardware in cleanroom.',
      'Developed simulations in Matlab for Attitude Determination and Control Subsystem.',
      'Developed processes for in lab testing and characterization of various subsystems.',
    ],
  }, {
    company: 'Facebook',
    position: 'Intern',
    link: 'http://facebook.com',
    daterange: 'June 2013 - September 2013',
    points: [
      'Developed software in python for automated testing of servers.',
      'Performed statistical analysis with R, HIVE to assist in triage of malfunctioning servers.',
      'Worked with vendors and ODM’s during triage to assist in risk mitigation.',
    ],
  }, {
    company: 'SEDS USA',
    position: 'At Large Board Member',
    link: 'http://seds.org',
    daterange: 'October 2013 - October 2014',
    points: [
      'Elected to Board of Directors of the USA’s largest student space advocacy group based on 5+ years of work with SEDS.',
      'Responsibilities included: organizational strategy, conference presentations, fundraising, special projects, promoting SEDS nationally and internationally, and photographing conferences.',
    ],
  },
];

class Job extends Component {

  getPoints() {
    return this.props.data.points.map((point) => {
      return (
        <li
        key={point}> {point} </li>
      );
    });
  }

  render() {
    return (
      <article>
        <header>
          <h4><a href={this.props.data.link}>{this.props.data.company}</a> - {this.props.data.position}</h4>
          <p className="daterange"> {this.props.data.daterange}</p>
        </header>
        <ul>
          {this.getPoints()}
        </ul>
      </article>
    );
  }
}

Job.propTypes = {
  data: PropTypes.object.isRequired,
};

class Experience extends Component {

  getRows() {
    return positions.map((job) => {
      return <Job
        data={job}
        key={job.company} />;
    });
  }

  render() {
    return (
      <div className="experience">
        <div className="title">
          <h3>Experience</h3>
        </div>
        {this.getRows()}
      </div>
    );
  }
}

export default Experience;
