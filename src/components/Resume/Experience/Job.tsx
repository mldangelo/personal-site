import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import type React from 'react';
import type { IWorkExperience } from '../../../data/resume/work';
import Entry from '../../Template/Entry';

export interface IJob {
  data: IWorkExperience;
}

const Job: React.FC<IJob> = ({
  data: { name, position, url, startDate, endDate, summary, highlights }
}) => (
  <Entry
    period={`${dayjs(startDate).format('MMM YYYY')} — ${
      endDate ? dayjs(endDate).format('MMM YYYY') : 'Present'
    }`}
  >
    <h3 className="font-serif text-[1.2rem]">{position}</h3>
    <a
      href={url}
      className="mt-1.5 mb-2.5 block font-mono text-[0.8rem] text-accent hover:underline"
    >
      {name}
    </a>

    {summary && (
      <div className="text-[0.92rem] leading-[1.65] text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
        <Markdown>{summary}</Markdown>
      </div>
    )}

    {highlights && (
      <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[0.92rem] leading-[1.65] text-muted marker:text-accent-soft [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
        {highlights.map((highlight) => (
          <li key={highlight}>
            <Markdown options={{ forceInline: true }}>{highlight}</Markdown>
          </li>
        ))}
      </ul>
    )}
  </Entry>
);

export default Job;
