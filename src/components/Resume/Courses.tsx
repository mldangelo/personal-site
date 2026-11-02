import type { Course } from '@/data/resume/courses';
import { smartQuotes } from '@/lib/typography';

export default function Courses({ data }: { data: Course[] }) {
  // Copy first: `sort` mutates in place, and this receives the imported
  // module array.
  const rows = [...data].sort(
    (a, b) =>
      b.university.localeCompare(a.university) ||
      a.number.localeCompare(b.number),
  );

  return (
    <div className="courses">
      <div className="section-header">
        <h2 className="section-heading">Selected courses</h2>
      </div>
      <ul className="course-list">
        {rows.map((course) => (
          <li className="course-container" key={course.title}>
            <a href={course.link}>
              <span className="course-number">{course.number}</span>
              {/* The columns separate code from title for the eye. Read aloud,
                  the link is one string, so a screen reader gets a colon. */}
              <span className="sr-only">: </span>
              <span className="course-name">{smartQuotes(course.title)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
