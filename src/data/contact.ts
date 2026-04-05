import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import { CONTACT_EMAIL } from '@/lib/utils';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://github.com/eliachrist',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: `mailto:${CONTACT_EMAIL}`,
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
