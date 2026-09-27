import type { Degree as DegreeType } from '@/data/resume/degrees';
import { newTabProps } from '@/lib/links';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  return (
    <article className="degree-container">
      <header>
        <h3 className="degree">{data.degree}</h3>
        <p className="school">
          <a href={data.link} {...newTabProps(data.link)}>
            {data.school}
          </a>
          , <time dateTime={String(data.year)}>{data.year}</time>
        </p>
      </header>
    </article>
  );
}
