'use client';

import React from 'react';

import dayjs from 'dayjs';

import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
}

const Cell: React.FC<CellProps> = ({ data }) => {
  return (
    <article className="group glass glass-hover rounded-lg p-6 mb-4 gpu-accelerated">
      <h3 className="text-lg font-semibold mb-1">{data.title}</h3>
      {data.subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{data.subtitle}</p>
      )}
      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">{data.desc}</p>
      <div className="flex items-center gap-4 text-sm">
        <time className="text-gray-500 dark:text-gray-500">
          {dayjs(data.date).format('MMMM YYYY')}
        </time>
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Project →
          </a>
        )}
      </div>
    </article>
  );
};

export default Cell;
