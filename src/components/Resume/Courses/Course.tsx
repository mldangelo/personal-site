import type { Course as CourseType } from '@/data/resume/courses';
import { smartQuotes } from '@/lib/typography';

interface CourseProps {
  data: CourseType;
}

export default function Course({ data }: CourseProps) {
  return (
    <li className="course-container">
      <a href={data.link}>
        <span className="course-number">{data.number}</span>
        {/* The columns separate code from title for the eye. Read aloud, the
            link is one string, so the colon that used to be printed after
            every code is kept for a screen reader only. */}
        <span className="sr-only">: </span>
        <span className="course-name">{smartQuotes(data.title)}</span>
      </a>
    </li>
  );
}
