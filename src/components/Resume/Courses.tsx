import React from 'react';

import type { Course as CourseType } from '@/data/resume/courses';

import Course from './Courses/Course';

interface CoursesProps {
  data: CourseType[];
}

const getRows = (courses: CourseType[]) =>
  courses
    .sort((a, b) => {
      let ret = 0;
      if (a.university > b.university) ret = -1;
      else if (a.university < b.university) ret = 1;
      else if (a.number > b.number) ret = 1;
      else if (a.number < b.number) ret = -1;
      return ret;
    })
    .map((course, idx) => (
      <Course data={course} key={course.title} last={idx === courses.length - 1} />
    ));

const Courses: React.FC<CoursesProps> = ({ data }) => (
  <div className="courses">
    <div className="link-to" id="courses" />
    <div className="title">
      <h3>Selected Courses</h3>
    </div>
    <ul className="course-list">{getRows(data)}</ul>
  </div>
);

export default Courses;
