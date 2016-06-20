import React, {Component, PropTypes} from 'react';

import _orderBy from 'lodash/orderBy';

import courses from './data/courses';

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

class Courses extends Component {

  getRows() {
    return _orderBy(courses, ['univerity','number'],['desc','asc'])
      .map((course) => {
      return <Course
        data={course}
        key={course.title} />;
    });
  }

  render() {
    return (
      <article>
      <div className="courses">
        <div className="title">
          <h3>Selected Courses</h3>
        </div>
          <ul>
          {this.getRows()}
          </ul>

      </div>
    </article>

    );
  }
}

export default Courses;
