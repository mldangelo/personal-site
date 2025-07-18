import React from 'react';

import { faCalendar, faClock, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';

import type { Position } from '@/data/resume/work';

interface JobProps {
  data: Position;
}

const Job: React.FC<JobProps> = ({ data }) => {
  const { name, position, url, startDate, endDate, summary, highlights } = data;

  return (
    <article className="group relative p-6 rounded-xl glass glass-border glass-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
      {/* Enhanced gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

      {/* Glassmorphism shine effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <header className="relative mb-4">
        <h4 className="text-xl font-bold text-foreground-bold mb-2">
          <a
            href={url}
            className="text-foreground-bold hover:text-accent transition-colors inline-flex items-center gap-2 group/link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity"
            />
          </a>{' '}
          - {position}
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
            {dayjs(startDate).format('MMM YYYY')} -{' '}
            {endDate ? dayjs(endDate).format('MMM YYYY') : 'Present'}
          </span>
          <span className="text-muted-foreground flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
            {endDate
              ? `${Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
              : 'Current'}
          </span>
        </div>
      </header>

      {summary ? (
        <Markdown
          options={{
            overrides: {
              p: {
                props: {
                  className: 'mb-4 text-foreground leading-relaxed',
                },
              },
              code: {
                props: {
                  className: 'px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm',
                },
              },
              pre: {
                props: {
                  className: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto',
                },
              },
            },
          }}
        >
          {summary}
        </Markdown>
      ) : null}

      {highlights ? (
        <ul className="list-disc list-inside space-y-1 text-foreground">
          {highlights.map((highlight) => (
            <li key={highlight} className="leading-relaxed">
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

export default Job;
