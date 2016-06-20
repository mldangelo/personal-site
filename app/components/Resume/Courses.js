import React, {Component, PropTypes} from 'react';

import courses from './data/courses';

// TODO remove last bullet / figure out how to add bullets with css

// TODO Package lodash sort instead.
const dynamicSort = (property) => {
  let sortOrder = 1;
  let prop = property;
  if (property[0] === '-') {
    sortOrder = -1;
    prop = property.substr(1);
  }
  return function(a, b) {
    const result = (a[property] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0);
    return result * sortOrder;
  };
};

const dynamicSortMultiple = () => {
  const props = arguments;
  return function(obj1, obj2) {
    let i = 0;
    let result = 0;
    const numberOfProperties = props.length;
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
};

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
    return courses.sort(dynamicSortMultiple('-univerity', 'number')).map((course) => {
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
