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
    <article className="mb-8 w-full overflow-hidden">
      <header className="mb-2">
        <h3 className="text-base font-semibold break-words">
          {position} at{' '}
          <a href={url} className="hover:underline" target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {dayjs(startDate).format('MMM YYYY')} –{' '}
          {endDate ? dayjs(endDate).format('MMM YYYY') : 'Present'}
        </p>
      </header>

      {summary ? (
        <div className="mb-4 text-sm">
          <Markdown
            options={{
              wrapper: 'div',
              forceWrapper: true,
              overrides: {
                p: {
                  component: ({ children, ...props }) => (
                    <p className="mb-2" {...props}>
                      {children}
                    </p>
                  ),
                },
                a: {
                  component: ({ children, href, ...props }) => (
                    <a
                      href={href}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                },
                code: {
                  component: ({ children, ...props }) => (
                    <span className="font-inherit" {...props}>
                      {children}
                    </span>
                  ),
                },
              },
            }}
          >
            {summary}
          </Markdown>
        </div>
      ) : null}

      {highlights ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

export default Job;
