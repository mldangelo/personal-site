import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
}

export default function Course({ data }: CourseProps) {
  return (
    <li className="course-container">
      <a href={data.link}>
        <h3 className="course-number">{data.number}:</h3>
        <p className="course-name">{data.title}</p>
      </a>
    </li>
  );
}
