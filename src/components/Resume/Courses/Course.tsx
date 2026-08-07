import type { ICourseInfo } from '../../../data/resume/courses';

export interface ICourse {
  data: ICourseInfo;
  last: boolean;
}

const Course = (data: ICourse) => (
  <li className="course-container">
    <a href={data.data.link}>
      <h4 className="course-number">{data.data.number}:</h4>
      <p className="course-name">{data.data.title}</p>
    </a>
    {!data.last && (
      <div className="course-dot">
        <p className="course-name"> &#8226;</p>
      </div>
    )}
  </li>
);

export default Course;
