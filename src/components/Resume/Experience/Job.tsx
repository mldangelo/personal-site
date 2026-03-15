'use client';

import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import type { ReactNode } from 'react';

import type { Position } from '@/data/resume/work';

function Passthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

interface JobProps {
  data: Position;
}

export default function Job({ data }: JobProps) {
  const { name, position, url, startDate, endDate, summary, highlights } = data;

  return (
    <article className="jobs-container">
      <header>
        <h4>
          <a href={url}>{name}</a> - {position}
        </h4>
        <p className="daterange">
          {' '}
          <time dateTime={startDate}>
            {dayjs(startDate).format('MMMM YYYY')}
          </time>{' '}
          -{' '}
          {endDate ? (
            <time dateTime={endDate}>{dayjs(endDate).format('MMMM YYYY')}</time>
          ) : (
            'Present'
          )}
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
                component: Passthrough,
              },
              pre: {
                component: Passthrough,
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
}
