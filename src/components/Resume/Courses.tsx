import type { Course as CourseType } from '@/data/resume/courses';

import Course from './Courses/Course';

interface CoursesProps {
  data: CourseType[];
}

function getRows(courses: CourseType[]) {
  return courses
    .sort((a, b) => {
      let ret = 0;
      if (a.university > b.university) ret = -1;
      else if (a.university < b.university) ret = 1;
      else if (a.number > b.number) ret = 1;
      else if (a.number < b.number) ret = -1;
      return ret;
    })
    .map((course) => <Course data={course} key={course.title} />);
}

export default function Courses({ data }: CoursesProps) {
  return (
    <div className="courses">
      <div className="link-to" id="courses" />
      <div className="title">
        <h3>Selected Courses</h3>
      </div>
      <ul className="course-list">{getRows(data)}</ul>
    </div>
  );
}
