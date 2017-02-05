import React, { Component } from 'react';

import Degree from './Education/Degree';
import degrees from './data/degrees';

class Education extends Component {

  getRows() {
    return degrees.map(degree => (
      <Degree
        data={degree}
        key={degree.school}
      />));
  }

  render() {
    return (
      <div className="education">
        <div className="title">
          <h3>Education</h3>
        </div>
        {this.getRows()}
      </div>
    );
  }
}

export default Education;
