import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/henrymatar/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://github.com/henrymatar',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    // One public address, shared with the contact CTA and JSON-LD.
    link: `mailto:${profile.email}`,
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
