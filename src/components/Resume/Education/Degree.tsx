import type { IDegree } from '../../../data/resume/degrees';

export interface IDegreeComponent {
  data: IDegree;
}

const Degree = (data: IDegreeComponent) => (
  <article className="border-l-2 border-border pl-5">
    <h3 className="font-medium">{data.data.degree}</h3>
    <p className="mt-1 text-sm text-muted">
      <a href={data.data.link} className="hover:text-accent">
        {data.data.school}
      </a>
      <span className="font-mono text-xs"> · {data.data.year}</span>
    </p>
  </article>
);

export default Degree;
