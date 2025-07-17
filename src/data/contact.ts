import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngellist } from '@fortawesome/free-brands-svg-icons/faAngellist';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://github.com/mldangelo',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://facebook.com/d',
    label: 'Facebook',
    icon: faFacebookF,
  },
  {
    link: 'https://www.instagram.com/dangelosaurus/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    link: 'https://www.linkedin.com/in/michaelldangelo',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://angel.co/michael-d-angelo',
    label: 'Angel List',
    icon: faAngellist,
  },
  {
    link: 'https://twitter.com/dangelosaurus',
    label: 'Twitter',
    icon: faTwitter,
  },
  {
    link: 'mailto:michael.l.dangelo@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
