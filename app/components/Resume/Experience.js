import React, { Component } from 'react';

import Job from './Experience/Job';
import positions from './data/positions';

class Experience extends Component {

  getRows() {
    return positions.map(job => (
      <Job
        data={job}
        key={job.company}
      />));
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
