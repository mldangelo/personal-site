'use client';

import React from 'react';

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
}

const Cell: React.FC<CellProps> = ({ data }) => {
  return (
    <a
      href={data.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card group relative overflow-hidden h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative -mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">
            {data.title}
          </h3>
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="w-4 h-4 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">{data.desc}</p>

        <time className="text-sm text-gray-500 dark:text-gray-600">
          {dayjs(data.date).format('MMMM YYYY')}
        </time>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>
    </a>
  );
};

export default Cell;
