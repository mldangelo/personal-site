import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import { CONTACT_EMAIL } from '@/lib/utils';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

/** Update handles in URLs if yours differ from @eliachrist / in/eliachrist. */
const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/eliakim-omari-0a9579241/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://github.com/magnificentcode',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://www.instagram.com/_eliachristt/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    link: 'https://x.com/eliachrist',
    label: 'X',
    icon: faTwitter,
  },
  {
    link: 'https://www.youtube.com/@eliachrist',
    label: 'YouTube',
    icon: faYoutube,
  },
  {
    link: `mailto:${CONTACT_EMAIL}`,
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
