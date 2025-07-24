import React from 'react';

import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';

import type { Position } from '@/data/resume/work';

interface JobProps {
  data: Position;
}

const Job: React.FC<JobProps> = ({ data }) => {
  const { name, position, url, startDate, endDate, summary, highlights } = data;

  return (
    <article className="jobs-container">
      <header>
        <h4>
          <a href={url}>{name}</a> - {position}
        </h4>
        <p className="daterange">
          {' '}
          {dayjs(startDate).format('MMMM YYYY')} -{' '}
          {endDate ? dayjs(endDate).format('MMMM YYYY') : 'PRESENT'}
        </p>
      </header>
      {summary ? (
        <Markdown
          options={{
            overrides: {
              p: {
                props: {
                  className: 'summary',
                },
              },
              code: {
                component: ({ children }) => <>{children}</>,
              },
              pre: {
                component: ({ children }) => <>{children}</>,
              },
            },
          }}
        >
          {summary}
        </Markdown>
      ) : null}
      {highlights ? (
        <ul className="points">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

export default Job;
