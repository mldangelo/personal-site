import React, {Component, PropTypes} from 'react';

import _orderBy from 'lodash/orderBy';

import Course from './Courses/Course';
import courses from './data/courses';

class Courses extends Component {

  getRows() {
    return _orderBy(courses, ['univerity', 'number'], ['desc', 'asc'])
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
