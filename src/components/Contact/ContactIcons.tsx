import React from 'react';

import data from '@/data/contact';

interface ContactIconsProps {
  className?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ className = '' }) => (
  <div className={`flex items-start gap-4 ${className}`}>
    {data.map((s) => (
      <a
        key={s.label}
        href={s.link}
        aria-label={s.label}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {s.label}
      </a>
    ))}
  </div>
);

export default ContactIcons;
