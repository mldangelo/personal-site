import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngellist } from '@fortawesome/free-brands-svg-icons/faAngellist';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export type ContactId =
  | 'linkedin'
  | 'github'
  | 'x'
  | 'angellist'
  | 'instagram'
  | 'facebook'
  | 'email';

export interface ContactItem {
  id: ContactId;
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    id: 'linkedin',
    link: 'https://www.linkedin.com/in/michaelldangelo',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    id: 'github',
    link: 'https://github.com/mldangelo',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    id: 'x',
    link: 'https://x.com/dangelosaurus',
    label: 'X',
    icon: faTwitter,
  },
  {
    id: 'angellist',
    link: 'https://angel.co/michael-d-angelo',
    label: 'Angel List',
    icon: faAngellist,
  },
  {
    id: 'instagram',
    link: 'https://www.instagram.com/dangelosaurus/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    id: 'facebook',
    link: 'https://facebook.com/d',
    label: 'Facebook',
    icon: faFacebookF,
  },
  {
    id: 'email',
    // One public address, shared with the contact CTA and JSON-LD.
    link: `mailto:${profile.email}`,
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
