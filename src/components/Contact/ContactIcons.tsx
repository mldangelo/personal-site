import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '@/data/contact';

interface ContactIconsProps {
  className?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    {data.map((s) => (
      <a
        key={s.label}
        href={s.link}
        aria-label={s.label}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary dark:hover:bg-accent transition-all duration-300 hover:scale-110 hover:shadow-lg"
      >
        <FontAwesomeIcon
          icon={s.icon}
          className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300"
        />
        {/* Tooltip */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {s.label}
        </span>
      </a>
    ))}
  </div>
);

export default ContactIcons;
