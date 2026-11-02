import type { Degree } from '@/data/resume/degrees';
import { smartQuotes } from '@/lib/typography';

export default function Education({ data }: { data: Degree[] }) {
  return (
    <div className="education">
      <div className="section-header">
        <h2 className="section-heading">Education</h2>
      </div>
      {data.map((degree) => (
        <article className="degree-container" key={degree.school}>
          <header>
            <h3 className="degree">{smartQuotes(degree.degree)}</h3>
            <p className="school">
              <a href={degree.link}>{smartQuotes(degree.school)}</a>,{' '}
              <time dateTime={String(degree.year)}>{degree.year}</time>
            </p>
          </header>
        </article>
      ))}
    </div>
  );
}
