import React, {Component, PropTypes} from 'react';

const positions = [
  {
    company: 'Zenysis',
    position: 'Consultant',
    link: 'http://zenysis.com',
    time: 'February 2016 - March 2016',
    points: [
      'Worked in Addis Ababa for the Ethiopian Ministry of Health and built data visualization tools in React, Flask.',
    ],
  }, {
    company: 'Matroid',
    position: 'Cofounder',
    link: 'http://matroid.com',
    time: 'July 2015 - January 2016',
    points: [
      'Developed end to end machine learning pipeline to train visual classifiers from keywords using Node.JS, Express, Keystone, MongoDB, AWS, S3, Caffe, and other technologies.',
      'Received Series A term sheets for 20M+ valuations.',
    ],
  }, {
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
          <p className="daterange"> {this.props.data.time}</p>
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

class Jobs extends Component {

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

export default Jobs;
