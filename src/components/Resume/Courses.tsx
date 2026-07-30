import type { Course as CourseType } from '@/data/resume/courses';

import Course from './Courses/Course';

interface CoursesProps {
  data: CourseType[];
}

function getRows(courses: CourseType[]) {
  // Copy first: `sort` mutates in place, and this receives the imported
  // module array, so rendering was reordering shared data as a side effect.
  return [...courses]
    .sort(
      (a, b) =>
        b.university.localeCompare(a.university) ||
        a.number.localeCompare(b.number),
    )
    .map((course) => <Course data={course} key={course.title} />);
}

export default function Courses({ data }: CoursesProps) {
  return (
    <div className="courses">
      <div className="title">
        <h2>Selected Courses</h2>
      </div>
      <ul className="course-list">{getRows(data)}</ul>
    </div>
  );
}
