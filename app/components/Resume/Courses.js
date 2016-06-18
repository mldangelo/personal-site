import React, {Component, PropTypes} from 'react';

const courses = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'http://stanford.edu/class/ee364a/',
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
  },
  {
    title: 'Convolutional Neural Networks for Visual Recognition',
    number: 'CS 231n',
    link: 'http://cs231n.stanford.edu/',
  },
  {
    title: 'Numerical Linear Algebra',
    number: 'CME 302',
    link: 'http://scpd.stanford.edu/search/publicCourseSearchDetails.do;jsessionid=561188A06434D7D97953C4706DE12831?method=load&courseId=11685',
  },
  {
    title: 'Numerical Optimization',
    number: 'CME 304',
    link: 'http://web.stanford.edu/class/cme304/',
  },
];

class Course extends Component {

  render() {
    return (
      <article>
        <header>
          <p>{this.props.data.number} : {this.props.data.title}</p>
        </header>
      </article>
    );
  }
}

Course.propTypes = {
  data: PropTypes.object.isRequired,
};


class Courses extends Component {

  getRows() {
    return courses.map((course) => {
      return <Course
        data={course}
        key={course.title} />;
    });
  }

  render() {
    return (
      <div className="courses">
        <div className="title">
          <h3>Courses</h3>
        </div>
        {this.getRows()}
      </div>
    );
  }
}

export default Courses;
