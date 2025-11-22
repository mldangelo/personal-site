import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import data from '@/data/contact';

const ContactIcons: React.FC = () => (
  <ul className="icons">
    {data.map((s) => (
      <li key={s.label}>
        <a
          href={s.link}
          aria-label={
            s.link.startsWith('mailto:')
              ? s.label
              : `${s.label} (external link)`
          }
        >
          <FontAwesomeIcon icon={s.icon} />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
