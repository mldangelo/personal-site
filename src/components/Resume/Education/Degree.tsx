import React from 'react';

import { faExternalLinkAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

const Degree: React.FC<DegreeProps> = ({ data }) => (
  <div className="card group relative overflow-hidden">
    {/* Accent stripe */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />

    <div className="pl-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="w-5 h-5 text-primary dark:text-accent"
            />
            {data.degree}
          </h4>
          <a
            href={data.link}
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors inline-flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.school}
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
        <span className="px-3 py-1 bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent text-sm font-medium rounded-full">
          {data.year}
        </span>
      </div>
    </div>
  </div>
);

export default Degree;
