import React, {Component, PropTypes} from 'react';

class Education extends Component {

  render() {
    return (
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
    );
  }
}

export default Education;
