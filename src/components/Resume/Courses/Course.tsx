import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
}

export default function Course({ data }: CourseProps) {
  return (
    <li className="course-container">
      <a href={data.link}>
        <span className="course-number">{data.number}:</span>
        <span className="course-name">{data.title}</span>
      </a>
    </li>
  );
}
