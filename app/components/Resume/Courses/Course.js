import React, {Component, PropTypes} from 'react';

// TODO remove last bullet / figure out how to add bullets with css

class Course extends Component {

  render() {
    return (
      <li>
        <a href={this.props.data.link}>
          <h4 className="course-number">{this.props.data.number}:</h4>
          <p className="course-name">{this.props.data.title}</p>
        </a>
        <p className="course-name"> &#8226;</p>
      </li>
    );
  }
}

Course.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Course
