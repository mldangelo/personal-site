import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import type React from 'react';
import type { IWorkExperience } from '../../../data/resume/work';

export interface IJob {
  data: IWorkExperience;
}

const Job: React.FC<IJob> = ({
  data: { name, position, url, startDate, endDate, summary, highlights }
}) => (
  <article className="border-l-2 border-border pl-5">
    <header>
      <h3 className="font-medium">
        <a href={url} className="hover:text-accent">
          {name}
        </a>
        <span className="text-muted"> · {position}</span>
      </h3>
      <p className="mt-1 font-mono text-xs text-muted">
        {dayjs(startDate).format('MMMM YYYY')} —{' '}
        {endDate ? dayjs(endDate).format('MMMM YYYY') : 'Present'}
      </p>
    </header>
    {summary && (
      <div className="mt-3 text-sm leading-relaxed text-muted">
        <Markdown>{summary}</Markdown>
      </div>
    )}
    {highlights && (
      <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
        {highlights.map((highlight) => (
          <li key={highlight}>
            <Markdown options={{ forceInline: true }}>{highlight}</Markdown>
          </li>
        ))}
      </ul>
    )}
  </article>
);

export default Job;
