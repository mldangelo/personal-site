import React, { Component, PropTypes } from 'react';

// TODO remove last bullet / figure out how to add bullets with css

class Course extends Component {

  render() {
    return (
      <li className="course-container">
        <a href={this.props.data.link}>
          <h4 className="course-number">{this.props.data.number}:</h4>
          <p className="course-name">{this.props.data.title}</p>
        </a>
        {this.props.last ? null : <div className="course-dot"><p className="course-name"> &#8226;</p></div>}
      </li>
    );
  }
}

Course.propTypes = {
  data: PropTypes.object.isRequired,
  last: PropTypes.bool,
};

export default Course;
