import React from 'react';
import { CourseInfo } from '../../data/resume/courses';
import Course from './Courses/Course';

const getRows = (courses: CourseInfo[]) =>
  courses
    .sort((a, b) => {
      let ret = 0;
      if (a.university.name > b.university.name) ret = -1;
      else if (a.university.name < b.university.name) ret = 1;
      else if (a.number > b.number) ret = 1;
      else if (a.number < b.number) ret = -1;
      return ret;
    })
    .map((course, idx) => (
      <Course
        data={course}
        key={course.title}
        last={idx === courses.length - 1}
      />
    ));

export interface Courses {
  data: CourseInfo[];
}

const Courses: React.FC<Courses> = ({ data }) => (
  <div className="courses">
    <div className="link-to" id="courses" />
    <div className="title">
      <h3>Selected Courses</h3>
    </div>
    <ul className="course-list">{getRows(data)}</ul>
  </div>
);

export default Courses;
