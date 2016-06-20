import React, {Component, PropTypes} from 'react';

import positions from './data/positions';

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
